const { onCall, HttpsError, onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const stripe = require("stripe");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Import templates and helper
const templates = require("./email-templates");
const brevo = require("./brevo-helper");

admin.initializeApp();

// Define secrets
const stripeSecret = defineSecret("STRIPE_SECRET_KEY");
const webhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const brevoApiKey = defineSecret("BREVO_API_KEY");
const emailFrom = defineSecret("EMAIL_FROM");
const adminEmail = defineSecret("ADMIN_EMAIL");

// Legacy Gmail (fallback if Brevo not configured)
const emailUser = defineSecret("EMAIL_USER");
const emailPass = defineSecret("EMAIL_PASSWORD");

/**
 * Helper: Send an email via Brevo or Nodemailer fallback
 */
async function sendEmail(params) {
    const { to, name, lastName, subject, html, text, type } = params;

    const apiKey = brevoApiKey.value();
    const fromVal = emailFrom.value() || "noreply@customisemeuk.com";
    const useBrevo = apiKey && apiKey !== "disabled";

    try {
        if (useBrevo) {
            let result;
            if (type === 'welcome') {
                const htmlVal = html || templates.getWelcomeEmailHTML(to);
                result = await brevo.sendWelcomeEmail(apiKey, to, name, lastName, fromVal, htmlVal);
            } else if (type === 'order') {
                const htmlVal = html || templates.getOrderConfirmationHTML(params.order, params.orderId);
                result = await brevo.sendOrderConfirmation(apiKey, params.order, params.orderId, fromVal, htmlVal);
            } else if (type === 'shipping') {
                const htmlVal = html || templates.getShippingNotificationHTML({
                    orderId: params.orderId,
                    trackingNumber: params.trackingNumber,
                    carrier: params.carrier,
                    estimatedDelivery: params.estimatedDelivery
                });
                result = await brevo.sendShippingNotification(apiKey, {
                    email: to,
                    firstName: name,
                    orderId: params.orderId,
                    trackingNumber: params.trackingNumber,
                    carrier: params.carrier,
                    estimatedDelivery: params.estimatedDelivery
                }, fromVal, htmlVal);
            } else if (type === 'account') {
                const htmlVal = html || templates.getAccountCreationHTML({ name, email: to });
                result = await brevo.sendAccountWelcome(apiKey, { email: to, name }, fromVal, htmlVal);
            } else {
                // Default generic transactional email via raw API
                result = await brevo.sendTransactionalEmail(apiKey, {
                    to: [{ email: to, name }],
                    subject,
                    htmlContent: html,
                    textContent: text
                }, fromVal);
            }
            logger.info(`Brevo email (${type}) sent to ${to}`);
            return true;
        } else if (emailUser.value() && emailPass.value()) {
            // Nodemailer Fallback
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: emailUser.value(), pass: emailPass.value() }
            });

            await transporter.sendMail({
                from: fromVal,
                to,
                subject,
                html,
                text
            });
            logger.info(`Nodemailer email sent to ${to}`);
            return true;
        } else {
            logger.error("No email provider configured (Brevo or Gmail)");
            return false;
        }
    } catch (error) {
        logger.error(`Email sending failed for ${to}:`, error);
        return false;
    }
}

/**
 * Create Stripe Checkout Session
 */
exports.createCheckoutSession = onCall({ secrets: [stripeSecret] }, async (request) => {
    const { items, email, shippingAddress, successUrl, cancelUrl, userId } = request.data;

    if (!items || !items.length) {
        throw new HttpsError('invalid-argument', 'The cart is empty.');
    }

    try {
        const stripeClient = stripe(stripeSecret.value());

        // Recalculate Totals from Firestore
        let subtotal = 0;
        for (const item of items) {
            const productDoc = await admin.firestore().collection('products').doc(item.productId).get();
            if (productDoc.exists) {
                const productData = productDoc.data();
                const qty = item.quantity || 1;

                if (productData.hasBulkPricing && productData.bulkPricing?.length > 0) {
                    const tiers = [...productData.bulkPricing].sort((a, b) => b.quantity - a.quantity);
                    const tier = tiers.find(t => qty >= t.quantity);
                    subtotal += tier ? tier.price : (productData.price || 0) * qty;
                } else {
                    let unitPrice = productData.price || 0;
                    if (item.customization?.printLocation === 'Front & Back') {
                        unitPrice += 5;
                    }
                    subtotal += unitPrice * qty;
                }
            } else {
                subtotal += (item.price || 0) * (item.quantity || 1);
            }
        }

        const tax = subtotal * 0.20;
        const shippingCost = subtotal >= 100 ? 0 : 4.99;

        // Generate sequential order ID
        const counterRef = admin.firestore().collection('metadata').doc('order_counter');
        const orderId = await admin.firestore().runTransaction(async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            let nextCount = 1;
            if (counterDoc.exists) {
                nextCount = (counterDoc.data().count || 0) + 1;
            }
            transaction.set(counterRef, { count: nextCount }, { merge: true });
            return `CMUK_${nextCount.toString().padStart(3, '0')}`;
        });

        const line_items = items.map(item => ({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: item.name,
                    images: item.imageUrl ? [item.imageUrl] : [],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        if (tax > 0) {
            line_items.push({
                price_data: {
                    currency: 'gbp',
                    product_data: { name: 'VAT (20%)' },
                    unit_amount: Math.round(tax * 100),
                },
                quantity: 1,
            });
        }

        if (shippingCost > 0) {
            line_items.push({
                price_data: {
                    currency: 'gbp',
                    product_data: { name: 'Shipping' },
                    unit_amount: Math.round(shippingCost * 100),
                },
                quantity: 1,
            });
        }

        // Create PENDING order
        await admin.firestore().collection('orders').doc(orderId).set({
            items,
            subtotal,
            tax,
            shipping: shippingCost,
            total: subtotal + tax + shippingCost,
            email,
            shippingAddress: shippingAddress || {},
            userId: userId || null,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const session = await stripeClient.checkout.sessions.create({
            line_items,
            mode: 'payment',
            customer_email: email,
            success_url: `${successUrl}?orderId=${orderId}`,
            cancel_url: cancelUrl,
            metadata: { orderId }
        });

        return { url: session.url };
    } catch (error) {
        logger.error("Stripe Session Error:", error);
        throw new HttpsError('internal', error.message);
    }
});

/**
 * Stripe Webhook Handler
 */
exports.stripeWebhook = onRequest({
    secrets: [stripeSecret, webhookSecret, brevoApiKey, emailFrom, adminEmail, emailUser, emailPass]
}, async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        const stripeClient = stripe(stripeSecret.value());
        event = stripeClient.webhooks.constructEvent(req.rawBody, sig, webhookSecret.value());
    } catch (err) {
        logger.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata.orderId;

        if (orderId) {
            try {
                const orderRef = admin.firestore().collection('orders').doc(orderId);
                const orderDoc = await orderRef.get();

                if (orderDoc.exists) {
                    const orderData = orderDoc.data();

                    await orderRef.update({
                        status: 'paid',
                        paidAt: admin.firestore.FieldValue.serverTimestamp(),
                        stripeSessionId: session.id
                    });

                    // Send Order Confirmation
                    await sendEmail({
                        to: orderData.email,
                        name: orderData.shippingAddress?.name || 'Customer',
                        type: 'order',
                        order: orderData,
                        orderId: orderId
                    });

                    // Notify Admin
                    await sendEmail({
                        to: adminEmail.value(),
                        subject: `New Order Received - ${orderId}`,
                        html: `<h3>New Order from ${orderData.shippingAddress?.name || "Customer"}</h3><p>Total: &pound;${orderData.total.toFixed(2)}</p><p>Order ID: ${orderId}</p>`,
                        text: `New Order from ${orderData.shippingAddress?.name || "Customer"}. Total: £${orderData.total.toFixed(2)}. Order ID: ${orderId}`
                    });
                }
            } catch (dbError) {
                logger.error(`Webhook processing failed for order ${orderId}:`, dbError);
                return res.status(500).send("Processing Failed");
            }
        }
    }

    res.status(200).json({ received: true });
});

/**
 * Send Welcome Email (Newsletter)
 */
exports.sendWelcomeEmail = onCall({
    secrets: [brevoApiKey, emailFrom, emailUser, emailPass]
}, async (request) => {
    const { email, firstName, lastName } = request.data || {};
    if (!email) throw new HttpsError('invalid-argument', 'Email is required.');

    const success = await sendEmail({
        to: email,
        name: firstName || 'there',
        lastName: lastName || '',
        type: 'welcome'
    });

    if (!success) throw new HttpsError('internal', 'Failed to send welcome email.');
    return { success: true };
});

/**
 * Send Order Confirmation (Manual/Admin)
 */
exports.sendOrderConfirmation = onCall({
    secrets: [brevoApiKey, emailFrom, emailUser, emailPass]
}, async (request) => {
    const { email, orderId, order } = request.data || {};
    if (!email || !orderId) throw new HttpsError('invalid-argument', 'Email and orderId are required.');

    const success = await sendEmail({
        to: email,
        name: order?.shippingAddress?.name || 'Customer',
        type: 'order',
        order: order,
        orderId: orderId
    });

    if (!success) throw new HttpsError('internal', 'Failed to send order email.');
    return { success: true };
});

/**
 * Send Shipping Notification
 */
exports.sendShippingNotification = onCall({
    secrets: [brevoApiKey, emailFrom, emailUser, emailPass]
}, async (request) => {
    const { email, firstName, orderId, trackingNumber, carrier, estimatedDelivery } = request.data || {};
    if (!email || !orderId) throw new HttpsError('invalid-argument', 'Email and orderId are required.');

    const success = await sendEmail({
        to: email,
        name: firstName || 'Customer',
        type: 'shipping',
        orderId,
        trackingNumber,
        carrier,
        estimatedDelivery
    });

    if (!success) throw new HttpsError('internal', 'Failed to send shipping notification.');
    return { success: true };
});

/**
 * Send Account Creation Email
 */
exports.sendAccountCreationEmail = onCall({
    secrets: [brevoApiKey, emailFrom, emailUser, emailPass]
}, async (request) => {
    const { email, name } = request.data || {};
    if (!email) throw new HttpsError('invalid-argument', 'Email is required.');

    const success = await sendEmail({
        to: email,
        name: name || 'there',
        type: 'account'
    });

    if (!success) throw new HttpsError('internal', 'Failed to send account creation email.');
    return { success: true };
});

/**
 * Submit Contact Form
 */
exports.submitContact = onCall({
    secrets: [brevoApiKey, emailFrom, adminEmail]
}, async (request) => {
    const data = request.data;
    const { name, email, service, message } = data;

    if (!name || !email || !service || !message) {
        throw new HttpsError('invalid-argument', 'Missing required fields.');
    }

    try {
        // Notify Admin
        await sendEmail({
            to: adminEmail.value(),
            subject: `New Inquiry: ${service} from ${name}`,
            html: templates.getContactEmailHTML(data)
        });

        // Auto-reply to customer
        await sendEmail({
            to: email,
            name: name,
            subject: "We received your message - Customise Me UK",
            html: `<p>Hi ${name},</p><p>Thank you for contacting Customise Me UK. We've received your inquiry regarding <strong>${service}</strong> and will get back to you within 24 hours.</p><p>Best regards,<br>The CMUK Team</p>`
        });

        return { success: true };
    } catch (error) {
        logger.error("Contact form processing failed:", error);
        throw new HttpsError('internal', 'Failed to send message.');
    }
});

/**
 * Send Newsletter Campaign
 */
exports.sendNewsletterCampaign = onCall({
    secrets: [brevoApiKey, emailFrom]
}, async (request) => {
    const { subject, htmlContent } = request.data;
    if (!subject || !htmlContent) throw new HttpsError('invalid-argument', 'Subject and content required.');

    try {
        const subscribersSnapshot = await admin.firestore()
            .collection('newsletter')
            .where('subscribed', '==', true)
            .get();

        if (subscribersSnapshot.empty) return { success: true, sent: 0 };

        let sent = 0;
        for (const doc of subscribersSnapshot.docs) {
            const subscriber = doc.data();
            const success = await sendEmail({
                to: subscriber.email,
                subject,
                html: htmlContent
            });
            if (success) sent++;
        }

        return { success: true, sent };
    } catch (error) {
        logger.error('Newsletter campaign failed:', error);
        throw new HttpsError('internal', 'Failed to send campaign.');
    }
});

/**
 * Unsubscribe Newsletter
 */
exports.unsubscribeNewsletter = onCall(async (request) => {
    const { email } = request.data;
    if (!email) throw new HttpsError('invalid-argument', 'Email is required.');

    try {
        const subscribersSnapshot = await admin.firestore()
            .collection('newsletter')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (subscribersSnapshot.empty) throw new HttpsError('not-found', 'Subscriber not found.');
        await subscribersSnapshot.docs[0].ref.update({ subscribed: false });
        return { success: true };
    } catch (error) {
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'Failed to unsubscribe.');
    }
});

/**
 * Track Order
 */
exports.trackOrder = onCall(async (request) => {
    const { orderId, email } = request.data;
    if (!orderId || !email) throw new HttpsError('invalid-argument', 'Missing orderId or email');

    try {
        const orderDoc = await admin.firestore().collection('orders').doc(orderId).get();
        if (!orderDoc.exists || orderDoc.data().email.toLowerCase() !== email.toLowerCase()) {
            return { success: false, message: 'Order not found' };
        }
        const data = orderDoc.data();
        return {
            success: true,
            order: {
                id: orderId,
                status: data.status || 'pending',
                trackingNumber: data.trackingNumber || null,
                carrier: data.carrier || null,
                estimatedDelivery: data.estimatedDelivery || null,
                total: data.total,
                createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null
            }
        };
    } catch (error) {
        throw new HttpsError('internal', 'Unable to track order');
    }
});
