require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initialize Firebase
// Note: You need to place your serviceAccountKey.json in the backend folder
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin Initialized');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin. Make sure serviceAccountKey.json exists.');
}

const db = admin.firestore();
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS || 'https://customisemeuk.com,https://www.customisemeuk.com').split(',')
}));

// IMPORTANT: Raw body for webhooks BEFORE json parser
app.use('/api/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json());

// ============================================
// ROUTE 1: Create Checkout Session
// ============================================
app.post('/api/checkout/create-session', async (req, res) => {
  try {
    const { cartItems, customerInfo, userId } = req.body;

    // Calculate prices server-side to prevent tampering
    let subtotal = 0;
    const items = [];

    for (const item of cartItems) {
      const productDoc = await db.collection('products').doc(item.productId).get();

      if (!productDoc.exists) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      const product = productDoc.data();
      // Use the actual price from database (in pence)
      const unitPriceInPence = Math.round((product.price || 0) * 100);
      const itemTotalInPence = unitPriceInPence * (item.quantity || 1);
      subtotal += itemTotalInPence;

      items.push({
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        unitPrice: unitPriceInPence,
        totalPrice: itemTotalInPence
      });
    }

    // Shipping calculation (Server-side)
    const shippingInPence = subtotal >= 10000 ? 0 : 499; // Free over £100
    const taxInPence = Math.round(subtotal * 0.20); // 20% VAT
    const finalTotalInPence = subtotal + shippingInPence + taxInPence;

    // Create order in database (Status: pending_payment)
    const orderRef = await db.collection('orders').add({
      userId: userId || 'guest',
      items: items,
      pricing: {
        subtotal: subtotal / 100,
        shipping: shippingInPence / 100,
        tax: taxInPence / 100,
        total: finalTotalInPence / 100,
        currency: 'gbp'
      },
      customerInfo: customerInfo,
      status: 'pending_payment',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map(item => ({
        price_data: {
          currency: 'gbp',
          product_data: { name: item.name },
          unit_amount: item.unitPrice
        },
        quantity: item.quantity
      })),
      customer_email: customerInfo.email,
      success_url: `${process.env.FRONTEND_URL || 'https://customisemeuk.com'}/order-confirmation.html?order=${orderRef.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://customisemeuk.com'}/checkout.html`,
      metadata: {
        orderId: orderRef.id
      }
    });

    await orderRef.update({
      stripeSessionId: session.id
    });

    res.json({ sessionId: session.id, orderId: orderRef.id });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTE 2: Verify Payment
// ============================================
app.post('/api/orders/verify-payment', async (req, res) => {
  try {
    const { orderId, sessionId } = req.body;

    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Update order status
    await db.collection('orders').doc(orderId).update({
      paymentStatus: 'paid',
      status: 'confirmed',
      paidAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ status: 'success', order: { id: orderId, status: 'confirmed' } });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTE 3: Stripe Webhook
// ============================================
app.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    if (orderId) {
      await db.collection('orders').doc(orderId).update({
        paymentStatus: 'paid',
        status: 'confirmed',
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
        webhookProcessed: true
      });
      console.log(`✅ Order ${orderId} confirmed via webhook`);
    }
  }

  res.json({ received: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   SECURE PAYMENT BACKEND RUNNING          ║
║   Port: ${PORT}                               ║
║   URL: http://localhost:${PORT}             ║
╚════════════════════════════════════════════╝
  `);
});