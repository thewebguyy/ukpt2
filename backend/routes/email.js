/**
 * Email API Routes - Brevo transactional and marketing emails
 */
import express from 'express';
import rateLimit from 'express-rate-limit';
import {
    sendWelcomeEmail,
    sendOrderConfirmation,
    sendShippingNotification,
    sendAccountWelcome,
    sendPasswordReset,
    addToNewsletter,
    addToCustomerList
} from '../services/emailService.js';
import { formatOrderItemsHtml, formatCurrency, formatDate } from '../utils/emailHelpers.js';
import {
    validateEmail,
    requireEmail,
    validateNewsletterSubscribe
} from '../middleware/validateEmail.js';

const router = express.Router();

// Newsletter: 5 requests per IP per hour
const newsletterLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Too many subscription attempts. Please try again later.', error: 'Rate limit exceeded' }
});

// Other endpoints: 20 requests per IP per hour
const generalLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many requests. Please try again later.', error: 'Rate limit exceeded' }
});

/**
 * POST /api/email/subscribe
 * Newsletter subscription: add to Brevo list + send welcome email with 10% discount
 */
router.post('/subscribe', newsletterLimiter, validateNewsletterSubscribe, async (req, res) => {
    try {
        const { email, firstName, lastName } = req.body;

        const addResult = await addToNewsletter(email, firstName, lastName);
        if (!addResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to add to newsletter list',
                error: addResult.error
            });
        }

        const emailResult = await sendWelcomeEmail(email, firstName);
        if (!emailResult.success) {
            console.error('[API] Welcome email failed after list add:', emailResult.error);
            return res.status(500).json({
                success: false,
                message: 'Subscribed but welcome email failed. Please contact support.',
                error: emailResult.error
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully subscribed! Check your inbox for your welcome discount.',
            data: { messageId: emailResult.messageId }
        });
    } catch (err) {
        console.error('[API] Subscribe error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to subscribe. Please try again.',
            error: err.message
        });
    }
});

/**
 * POST /api/email/order-confirmation
 * Send order confirmation email (called by Stripe webhook or order completion)
 */
router.post('/order-confirmation', generalLimiter, async (req, res) => {
    try {
        const body = req.body || {};
        const {
            email,
            firstName,
            orderNumber,
            orderDate,
            orderTotal,
            items,
            shippingAddress,
            trackingLink
        } = body;

        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ success: false, message: emailValidation.error, error: emailValidation.error });
        }

        const itemsHtml = Array.isArray(items)
            ? formatOrderItemsHtml(items)
            : (body.itemsHtml || '');

        const orderData = {
            email: email.trim().toLowerCase(),
            firstName: firstName || 'Customer',
            orderNumber: orderNumber || 'N/A',
            orderDate: orderDate || formatDate(new Date()),
            orderTotal: orderTotal || formatCurrency(0),
            itemsHtml,
            shippingAddress: formatShippingAddress(shippingAddress),
            trackingLink: trackingLink || `${process.env.BASE_URL || 'https://customisemeuk.com'}/order-tracking`
        };

        const result = await sendOrderConfirmation(orderData);
        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send order confirmation',
                error: result.error
            });
        }

        const customerName = (firstName || '').trim().split(' ')[0] || 'Customer';
        const addCustomerResult = await addToCustomerList(
            orderData.email,
            customerName,
            (firstName || '').trim().split(' ').slice(1).join(' ') || '',
            { total: parseFloat(String(orderTotal || '0').replace(/[£,]/g, '')) }
        );
        if (!addCustomerResult.success) {
            console.warn('[API] addToCustomerList failed:', addCustomerResult.error);
        }

        return res.status(200).json({
            success: true,
            message: 'Order confirmation sent successfully',
            data: { messageId: result.messageId }
        });
    } catch (err) {
        console.error('[API] Order confirmation error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to send order confirmation',
            error: err.message
        });
    }
});

/**
 * POST /api/email/shipping-notification
 * Send shipping notification when order status changes to Shipped
 */
router.post('/shipping-notification', generalLimiter, async (req, res) => {
    try {
        const { email, firstName, orderNumber, trackingNumber, carrier, estimatedDelivery } = req.body || {};

        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ success: false, message: emailValidation.error, error: emailValidation.error });
        }

        const result = await sendShippingNotification({
            email: email.trim().toLowerCase(),
            firstName: firstName || 'Customer',
            orderNumber: orderNumber || 'N/A',
            trackingNumber: trackingNumber || '',
            carrier: carrier || 'Royal Mail',
            estimatedDelivery: estimatedDelivery || '3-5 business days'
        });

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send shipping notification',
                error: result.error
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Shipping notification sent successfully',
            data: { messageId: result.messageId }
        });
    } catch (err) {
        console.error('[API] Shipping notification error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to send shipping notification',
            error: err.message
        });
    }
});

/**
 * POST /api/email/account-welcome
 * Send account creation welcome email
 */
router.post('/account-welcome', generalLimiter, async (req, res) => {
    try {
        const { email, firstName } = req.body || {};

        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ success: false, message: emailValidation.error, error: emailValidation.error });
        }

        const result = await sendAccountWelcome({
            email: email.trim().toLowerCase(),
            firstName: firstName || 'Customer'
        });

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send account welcome email',
                error: result.error
            });
        }

        const addResult = await addToCustomerList(email.trim().toLowerCase(), firstName || 'Customer', '');
        if (!addResult.success) {
            console.warn('[API] addToCustomerList for new account failed:', addResult.error);
        }

        return res.status(200).json({
            success: true,
            message: 'Account welcome email sent successfully',
            data: { messageId: result.messageId }
        });
    } catch (err) {
        console.error('[API] Account welcome error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to send account welcome email',
            error: err.message
        });
    }
});

/**
 * POST /api/email/password-reset
 * Send password reset email with time-limited link
 */
router.post('/password-reset', generalLimiter, requireEmail, async (req, res) => {
    try {
        const { email, firstName, resetToken } = req.body || {};

        if (!resetToken) {
            return res.status(400).json({
                success: false,
                message: 'Reset token is required',
                error: 'Invalid request'
            });
        }

        const result = await sendPasswordReset(
            req.body.email,
            firstName || 'Customer',
            resetToken
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send password reset email',
                error: result.error
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully',
            data: { messageId: result.messageId }
        });
    } catch (err) {
        console.error('[API] Password reset error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to send password reset email',
            error: err.message
        });
    }
});

function formatShippingAddress(addr) {
    if (!addr || typeof addr !== 'object') return '—';
    const parts = [
        addr.name,
        addr.address,
        [addr.city, addr.postcode].filter(Boolean).join(' '),
        addr.country || 'United Kingdom'
    ].filter(Boolean);
    return parts.join(', ') || '—';
}

export default router;
