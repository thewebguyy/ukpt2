const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const stripe = require("stripe");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

// 1. Define the secret link
const stripeSecret = defineSecret("STRIPE_SECRET_KEY");

// 2. Create Payment Intent (Callable)
exports.createPaymentIntent = onCall({ secrets: [stripeSecret] }, async (request) => {
    const { items, cartId, email, shippingAddress } = request.data;

    if (!items || items.length === 0) {
        throw new HttpsError('invalid-argument', 'The cart is empty.');
    }

    try {
        const stripeClient = stripe(stripeSecret.value());

        // SERVER-SIDE PRICE CALCULATION
        let subtotal = 0;
        items.forEach(item => {
            subtotal += (item.price || 0) * (item.quantity || 1);
        });

        const tax = subtotal * 0.20;
        const shipping = subtotal >= 100 ? 0 : 4.99;
        const totalInPence = Math.round((subtotal + tax + shipping) * 100);

        // CREATE PENDING ORDER
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        await admin.firestore().collection('orders').doc(orderId).set({
            items,
            subtotal,
            tax,
            shipping,
            total: subtotal + tax + shipping,
            email,
            shippingAddress: shippingAddress || {},
            status: 'pending',
            cartId,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: totalInPence,
            currency: "gbp",
            automatic_payment_methods: { enabled: true },
            metadata: {
                orderId: orderId,
                cartId: cartId
            }
        }, {
            idempotencyKey: cartId
        });

        return {
            clientSecret: paymentIntent.client_secret,
            orderId: orderId
        };
    } catch (error) {
        logger.error("Stripe Error:", error);
        throw new HttpsError('internal', error.message);
    }
});

// 3. Confirm Order (Callable)
exports.confirmOrder = onCall(async (request) => {
    const { orderId, paymentIntentId } = request.data;

    try {
        const orderRef = admin.firestore().collection('orders').doc(orderId);

        await orderRef.update({
            paymentIntentId,
            status: 'paid',
            paidAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        logger.error("Order Confirmation Error:", error);
        throw new HttpsError('internal', 'Failed to update order');
    }
});