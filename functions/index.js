const { onCall, HttpsError, onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const stripe = require("stripe");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const {
    getOrderConfirmationHTML,
    getContactEmailHTML,
    getWelcomeEmailHTML,
    getShippingNotificationHTML,
    getAccountCreationHTML,
    getContactConfirmationHTML
} = require("./email-templates");

admin.initializeApp();

// Define secrets
const stripeSecret = defineSecret("STRIPE_SECRET_KEY");
const webhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const emailUser = defineSecret("EMAIL_USER");
const emailPass = defineSecret("EMAIL_PASSWORD");
const emailFrom = defineSecret("EMAIL_FROM");
const adminEmail = defineSecret("ADMIN_EMAIL");

/**
 * Helper: Send Order Confirmation Email
 */
async function sendOrderEmail(order, orderId, secrets) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: secrets.user,
                pass: secrets.pass
            }
        });

        const html = getOrderConfirmationHTML(order, orderId);

        const mailOptions = {
            from: secrets.from,
            to: order.email,
            subject: `Order Confirmed: ${orderId}`,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${order.email}: ${info.messageId}`);

        // Also notify admin
        await transporter.sendMail({
            from: secrets.from,
            to: secrets.admin,
            subject: `New Order Received - ${orderId}`,
            html: `<h3>New Order from ${(order.shippingAddress.name || '').replace(/[<>"'&]/g, '')}</h3><p>Total: &pound;${order.total.toFixed(2)}</p><p>Order ID: ${orderId}</p>`
        });

        return true;
    } catch (error) {
        logger.error("Email sending failed:", error);
        return false;
    }
}

/**
 * Create Stripe Checkout Session
 * Recalculates totals, creates a pending order, and returns session URL
 */
exports.createCheckoutSession = onCall({ secrets: [stripeSecret] }, async (request) => {
    const { items, email, shippingAddress, successUrl, cancelUrl } = request.data;

    if (!items || !items.length) {
        throw new HttpsError('invalid-argument', 'The cart is empty.');
    }

    try {
        const stripeClient = stripe(stripeSecret.value());

        // Recalculate Totals from Firestore (Backend Source of Truth)
        let subtotal = 0;
        for (const item of items) {
            const productDoc = await admin.firestore().collection('products').doc(item.productId).get();
            if (productDoc.exists) {
                const productData = productDoc.data();
                const qty = item.quantity || 1;

                // Use bulk pricing if applicable
                if (productData.hasBulkPricing && productData.bulkPricing && productData.bulkPricing.length > 0) {
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
                // Fallback to client price if product not found (shouldn't happen)
                subtotal += (item.price || 0) * (item.quantity || 1);
            }
        }

        const tax = subtotal * 0.20;
        const shippingCost = subtotal >= 100 ? 0 : 4.99;

        // Generate sequential order ID: CMUK_001, CMUK_002, etc.
        const counterRef = admin.firestore().collection('metadata').doc('order_counter');
        const orderId = await admin.firestore().runTransaction(async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            let nextCount = 1;

            if (counterDoc.exists) {
                nextCount = (counterDoc.data().count || 0) + 1;
            }

            transaction.set(counterRef, { count: nextCount }, { merge: true });

            // Format as CMUK_001 (padded to 3 digits)
            return `CMUK_${nextCount.toString().padStart(3, '0')}`;
        });

        const line_items = items.map(item => ({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: item.name,
                    images: item.imageUrl ? [item.imageUrl] : [],
                },
                unit_amount: Math.round(item.price * 100), // pence
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

        // 1. Create PENDING order document
        await admin.firestore().collection('orders').doc(orderId).set({
            items,
            subtotal,
            tax,
            shipping: shippingCost,
            total: subtotal + tax + shippingCost,
            email,
            shippingAddress: shippingAddress || {},
            userId: request.data.userId || null, // Link to user if logged in
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 2. Create Stripe Session
        const session = await stripeClient.checkout.sessions.create({
            line_items,
            mode: 'payment',
            customer_email: email,
            success_url: `${successUrl}?orderId=${orderId}`,
            cancel_url: cancelUrl,
            metadata: {
                orderId: orderId
            }
        });

        return { url: session.url };
    } catch (error) {
        logger.error("Stripe Session Creation Error:", error);
        throw new HttpsError('internal', error.message);
    }
});

/**
 * Submit Contact Form
 */
exports.submitContact = onCall({
    secrets: [emailUser, emailPass, emailFrom, adminEmail]
}, async (request) => {
    const data = request.data;
    const { name, email, service, message } = data;

    if (!name || !email || !service || !message) {
        throw new HttpsError('invalid-argument', 'Missing required fields.');
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser.value(),
                pass: emailPass.value()
            }
        });

        const html = getContactEmailHTML(data);

        // Notify Admin
        await transporter.sendMail({
            from: emailFrom.value(),
            to: adminEmail.value(),
            subject: `New Inquiry: ${service} from ${name}`,
            html: html
        });

        // Auto-reply to customer
        await transporter.sendMail({
            from: emailFrom.value(),
            to: email,
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
 * Stripe Webhook Handler
 * Processes checkout.session.completed to update order status
 */
exports.stripeWebhook = onRequest({
    secrets: [stripeSecret, webhookSecret, emailUser, emailPass, emailFrom, adminEmail]
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

                    // Update to 'paid'
                    await orderRef.update({
                        status: 'paid',
                        paidAt: admin.firestore.FieldValue.serverTimestamp(),
                        stripeSessionId: session.id
                    });

                    // Send Confirmation Email
                    await sendOrderEmail(orderData, orderId, {
                        user: emailUser.value(),
                        pass: emailPass.value(),
                        from: emailFrom.value(),
                        admin: adminEmail.value()
                    });

                    logger.info(`Order ${orderId} successfully completed and email sent.`);
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
 * Send Welcome Email — Called when a user subscribes to the newsletter
 */
exports.sendWelcomeEmail = onCall({
    secrets: [emailUser, emailPass, emailFrom]
}, async (request) => {
    const { email } = request.data;

    if (!email) {
        throw new HttpsError('invalid-argument', 'Email is required.');
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: emailUser.value(), pass: emailPass.value() }
        });

        const html = getWelcomeEmailHTML(email);

        await transporter.sendMail({
            from: emailFrom.value(),
            to: email,
            subject: 'Welcome to Customise Me UK!',
            html
        });

        logger.info(`Welcome email sent to ${email}`);
        return { success: true };
    } catch (error) {
        logger.error('Welcome email failed:', error);
        throw new HttpsError('internal', 'Failed to send welcome email.');
    }
});

/**
 * Send Shipping Notification — Called from admin when an order ships
 */
exports.sendShippingNotification = onCall({
    secrets: [emailUser, emailPass, emailFrom]
}, async (request) => {
    const { email, orderId, trackingNumber, carrier, estimatedDelivery } = request.data;

    if (!email || !orderId) {
        throw new HttpsError('invalid-argument', 'Email and orderId are required.');
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: emailUser.value(), pass: emailPass.value() }
        });

        const html = getShippingNotificationHTML({ orderId, trackingNumber, carrier, estimatedDelivery });

        await transporter.sendMail({
            from: emailFrom.value(),
            to: email,
            subject: `Your Order ${orderId} Has Been Shipped!`,
            html
        });

        logger.info(`Shipping notification sent to ${email} for order ${orderId}`);
        return { success: true };
    } catch (error) {
        logger.error('Shipping notification failed:', error);
        throw new HttpsError('internal', 'Failed to send shipping notification.');
    }
});

/**
 * Send Account Creation Email — Called on user registration
 */
exports.sendAccountCreationEmail = onCall({
    secrets: [emailUser, emailPass, emailFrom]
}, async (request) => {
    const { email, name } = request.data;

    if (!email) {
        throw new HttpsError('invalid-argument', 'Email is required.');
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: emailUser.value(), pass: emailPass.value() }
        });

        const html = getAccountCreationHTML({ name, email });

        await transporter.sendMail({
            from: emailFrom.value(),
            to: email,
            subject: 'Welcome to Customise Me UK — Account Created',
            html
        });

        logger.info(`Account creation email sent to ${email}`);
        return { success: true };
    } catch (error) {
        logger.error('Account creation email failed:', error);
        throw new HttpsError('internal', 'Failed to send account creation email.');
    }
});

/**
 * Send Contact Confirmation Email — Called after contact form submit
 */
exports.sendContactConfirmation = onCall({
    secrets: [emailUser, emailPass, emailFrom]
}, async (request) => {
    const { email, name, subject, message } = request.data;

    if (!email || !name) {
        throw new HttpsError('invalid-argument', 'Email and name are required.');
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: emailUser.value(), pass: emailPass.value() }
        });

        const html = getContactConfirmationHTML({ name, email, subject, message });

        await transporter.sendMail({
            from: emailFrom.value(),
            to: email,
            subject: 'We received your message — Customise Me UK',
            html
        });

        logger.info(`Contact confirmation email sent to ${email}`);
        return { success: true };
    } catch (error) {
        logger.error('Contact confirmation email failed:', error);
        throw new HttpsError('internal', 'Failed to send contact confirmation.');
    }
});

/**
 * Send Newsletter Campaign — Admin sends newsletter to all subscribers
 */
exports.sendNewsletterCampaign = onCall({
    secrets: [emailUser, emailPass, emailFrom]
}, async (request) => {
    const { subject, htmlContent } = request.data;

    if (!subject || !htmlContent) {
        throw new HttpsError('invalid-argument', 'Subject and htmlContent are required.');
    }

    try {
        const subscribersSnapshot = await admin.firestore()
            .collection('newsletter')
            .where('subscribed', '==', true)
            .get();

        if (subscribersSnapshot.empty) {
            return { success: true, sent: 0 };
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: emailUser.value(), pass: emailPass.value() }
        });

        let sent = 0;
        for (const doc of subscribersSnapshot.docs) {
            const subscriber = doc.data();
            try {
                await transporter.sendMail({
                    from: emailFrom.value(),
                    to: subscriber.email,
                    subject,
                    html: htmlContent
                });
                sent++;
            } catch (err) {
                logger.warn(`Failed to send to ${subscriber.email}:`, err.message);
            }
        }

        logger.info(`Newsletter campaign sent to ${sent} subscribers`);
        return { success: true, sent };
    } catch (error) {
        logger.error('Newsletter campaign failed:', error);
        throw new HttpsError('internal', 'Failed to send newsletter campaign.');
    }
});

/**
 * Unsubscribe Newsletter — Updates subscriber doc to subscribed: false
 */
exports.unsubscribeNewsletter = onCall(async (request) => {
    const { email } = request.data;

    if (!email) {
        throw new HttpsError('invalid-argument', 'Email is required.');
    }

    try {
        const subscribersSnapshot = await admin.firestore()
            .collection('newsletter')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (subscribersSnapshot.empty) {
            throw new HttpsError('not-found', 'Subscriber not found.');
        }

        await subscribersSnapshot.docs[0].ref.update({ subscribed: false });

        logger.info(`${email} unsubscribed from newsletter`);
        return { success: true };
    } catch (error) {
        if (error instanceof HttpsError) throw error;
        logger.error('Unsubscribe failed:', error);
        throw new HttpsError('internal', 'Failed to unsubscribe.');
    }
});