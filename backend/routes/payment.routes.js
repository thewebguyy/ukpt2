/**
 * PAYMENT ROUTES - Stripe Integration
 * Handles payment processing and webhooks
 */

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order, Product, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { sendOrderConfirmationEmail } = require('../services/email.service');

// ============================================
// CREATE PAYMENT INTENT
// ============================================

router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Validate items and calculate total
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        customization: item.customization || {},
        subtotal: itemTotal
      });
    }

    // Calculate shipping
    const shipping = subtotal >= 50 ? 0 : 4.99;
    
    // Calculate tax (20% VAT)
    const tax = (subtotal + shipping) * 0.20;
    
    // Total amount in pence (Stripe uses smallest currency unit)
    const total = subtotal + shipping + tax;
    const amountInPence = Math.round(total * 100);

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: 'gbp',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user.id,
        itemCount: items.length,
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2)
      }
    });

    // Create pending order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress: {
        name: shippingAddress.name,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        apartment: shippingAddress.apartment,
        city: shippingAddress.city,
        postcode: shippingAddress.postcode,
        country: shippingAddress.country || 'United Kingdom'
      },
      pricing: {
        subtotal,
        shipping,
        tax,
        discount: 0,
        total
      },
      payment: {
        method: 'card',
        status: 'pending',
        stripePaymentIntentId: paymentIntent.id
      },
      status: 'pending'
    });

    order.calculateTotals();
    await order.save();

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        orderId: order._id,
        orderNumber: order.orderNumber,
        amount: total,
        currency: 'GBP'
      }
    });

  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
});

// ============================================
// CONFIRM PAYMENT
// ============================================

router.post('/confirm-payment', authenticateToken, async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Update order
    const order = await Order.findById(orderId)
      .populate('user')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.payment.status = 'completed';
    order.payment.transactionId = paymentIntent.id;
    order.payment.paidAt = new Date();
    order.status = 'confirmed';
    
    order.timeline.push({
      status: 'confirmed',
      message: 'Payment received and order confirmed'
    });

    await order.save();

    // Reduce product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(order);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Payment Confirmation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    });
  }
});

// ============================================
// STRIPE WEBHOOK
// ============================================

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      
      // Update order status
      const order = await Order.findOne({ 
        'payment.stripePaymentIntentId': paymentIntent.id 
      });
      
      if (order && order.payment.status === 'pending') {
        order.payment.status = 'completed';
        order.payment.paidAt = new Date();
        order.status = 'confirmed';
        order.timeline.push({
          status: 'confirmed',
          message: 'Payment confirmed via webhook'
        });
        await order.save();
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      
      const failedOrder = await Order.findOne({ 
        'payment.stripePaymentIntentId': failedPayment.id 
      });
      
      if (failedOrder) {
        failedOrder.payment.status = 'failed';
        failedOrder.status = 'cancelled';
        failedOrder.timeline.push({
          status: 'cancelled',
          message: 'Payment failed'
        });
        await failedOrder.save();
      }
      break;

    case 'charge.refunded':
      const refund = event.data.object;
      console.log('Refund processed:', refund.id);
      
      const refundedOrder = await Order.findOne({ 
        'payment.transactionId': refund.payment_intent 
      });
      
      if (refundedOrder) {
        refundedOrder.payment.status = 'refunded';
        refundedOrder.timeline.push({
          status: 'refunded',
          message: 'Payment refunded'
        });
        await refundedOrder.save();
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// ============================================
// GET PAYMENT METHODS
// ============================================

router.get('/payment-methods', authenticateToken, async (req, res) => {
  try {
    // In production, you'd retrieve saved payment methods from Stripe
    res.json({
      success: true,
      data: {
        availableMethods: ['card', 'paypal', 'bank_transfer'],
        savedCards: [] // Would contain user's saved cards
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment methods'
    });
  }
});

// ============================================
// REFUND REQUEST
// ============================================

router.post('/refund', authenticateToken, async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify user owns the order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to refund this order'
      });
    }

    if (order.payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot refund uncompleted payment'
      });
    }

    // Process refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.payment.stripePaymentIntentId,
      reason: 'requested_by_customer',
      metadata: {
        orderId: order._id.toString(),
        reason
      }
    });

    order.payment.status = 'refunded';
    order.status = 'cancelled';
    order.timeline.push({
      status: 'refunded',
      message: `Refund requested: ${reason}`
    });

    await order.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });

  } catch (error) {
    console.error('Refund Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message
    });
  }
});

module.exports = router;