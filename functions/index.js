const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe ? functions.config().stripe.secret_key : "sk_test_PLACEHOLDER"); // User must set this config
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// ==========================================
// 1. SECURE PAYMENT INTENT
// ==========================================
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
    // Ensure user is authenticated (optional, but recommended)
    // if (!context.auth) {
    //   throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    // }

    const { items, shippingAddress, email } = data;

    if (!items || items.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with an items array.');
    }

    try {
        let totalAmount = 0;
        const orderItems = [];

        // Validated prices from server (Firestore)
        for (const item of items) {
            const productDoc = await db.collection('products').doc(item.productId).get();

            if (!productDoc.exists) {
                throw new functions.https.HttpsError('not-found', `Product ${item.productId} not found`);
            }

            const productData = productDoc.data();
            const price = productData.price; // Trust only server price

            // Check stock
            if (productData.stock < item.quantity) {
                throw new functions.https.HttpsError('failed-precondition', `Insufficient stock for ${productData.name}`);
            }

            totalAmount += price * item.quantity;

            orderItems.push({
                productId: item.productId,
                name: productData.name,
                price: price, // Store the price at time of purchase
                quantity: item.quantity,
                customization: item.customization || {}
            });
        }

        // Shipping Logic (Simple tier)
        let shippingCost = 4.99;
        if (totalAmount >= 50) {
            shippingCost = 0;
        }

        // Tax Calculation (20% VAT)
        const tax = (totalAmount + shippingCost) * 0.20;
        const finalTotal = totalAmount + shippingCost + tax;

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(finalTotal * 100), // Stripe expects cents
            currency: "gbp",
            metadata: {
                email: email || (context.auth ? context.auth.token.email : "guest"),
                items: JSON.stringify(items.map(i => ({ id: i.productId, q: i.quantity })))
            },
            shipping: {
                name: shippingAddress.name,
                address: {
                    line1: shippingAddress.street,
                    line2: shippingAddress.apartment,
                    city: shippingAddress.city,
                    postal_code: shippingAddress.postcode,
                    country: 'GB'
                }
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // Create a wrapper "Pending Order" in Firestore
        const orderRef = await db.collection('orders').add({
            userId: context.auth ? context.auth.uid : 'guest',
            email: email,
            items: orderItems,
            amountSubtotal: totalAmount,
            amountShipping: shippingCost,
            amountTax: tax,
            amountTotal: finalTotal,
            currency: 'gbp',
            status: 'pending_payment',
            paymentIntentId: paymentIntent.id,
            shippingAddress: shippingAddress,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
            clientSecret: paymentIntent.client_secret,
            orderId: orderRef.id,
            amounts: {
                subtotal: totalAmount,
                shipping: shippingCost,
                tax: tax,
                total: finalTotal
            }
        };

    } catch (error) {
        console.error("Payment Intent Error:", error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

// ==========================================
// 2. CONFIRM ORDER (Post-Webhook simulation)
// ==========================================
// Ideally, use Stripe Webhooks. specific confirm endpoint for client sync.
exports.confirmOrder = functions.https.onCall(async (data, context) => {
    const { orderId, paymentIntentId } = data;

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Order not found');
    }

    const orderData = orderDoc.data();

    // Verify inputs match
    if (orderData.paymentIntentId !== paymentIntentId) {
        throw new functions.https.HttpsError('permission-denied', 'Payment ID mismatch');
    }

    // Retrieve Intent status from Stripe to be sure
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
        // Update Order Status
        await orderRef.update({
            status: 'paid',
            paidAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // DECREMENT STOCK
        // Run as transaction to ensure atomicity
        await db.runTransaction(async (t) => {
            for (const item of orderData.items) {
                const productRef = db.collection('products').doc(item.productId);
                const productSnapshot = await t.get(productRef);
                if (productSnapshot.exists) {
                    const newStock = Math.max(0, productSnapshot.data().stock - item.quantity);
                    t.update(productRef, { stock: newStock });
                }
            }
        });

        return { success: true, orderNumber: orderId };
    } else {
        throw new functions.https.HttpsError('failed-precondition', 'Payment not successful yet');
    }
});

// ==========================================
// 3. REVIEWS SYSTEM
// ==========================================
exports.addReview = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to review');
    }

    const { productId, rating, comment, userName } = data;

    // Basic validation
    if (rating < 1 || rating > 5) throw new functions.https.HttpsError('invalid-argument', 'Rating must be 1-5');

    // Add Review
    await db.collection('products').doc(productId).collection('reviews').add({
        userId: context.auth.uid,
        userName: userName || 'Anonymous',
        rating: Number(rating),
        comment: comment,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        verifiedPurchase: true // You would assume true if checking orders dynamically
    });

    // Aggregation (Average Rating) - Trigger preferred, but doing inline for MVP
    const reviewsSnapshot = await db.collection('products').doc(productId).collection('reviews').get();
    let totalStars = 0;
    let count = 0;

    reviewsSnapshot.forEach(doc => {
        totalStars += doc.data().rating;
        count++;
    });

    const averageRating = count > 0 ? (totalStars / count) : 0;

    await db.collection('products').doc(productId).update({
        rating: averageRating,
        reviewCount: count
    });

    return { success: true };
});
