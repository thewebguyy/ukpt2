/**
 * Brevo Email Service - Single source for all transactional and marketing emails
 */
import {
    TransactionalEmailsApi,
    ContactsApi,
    TransactionalEmailsApiApiKeys,
    ContactsApiApiKeys
} from '@getbrevo/brevo';

const API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@customisemeuk.com';
const SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Customise Me UK';
const BASE_URL = process.env.BASE_URL || 'https://customisemeuk.com';
const NEWSLETTER_LIST_ID = parseInt(process.env.BREVO_NEWSLETTER_LIST_ID || '2', 10);
const CUSTOMERS_LIST_ID = parseInt(process.env.BREVO_CUSTOMERS_LIST_ID || '3', 10);

let transactionalApi = null;

function getTransactionalApi() {
    if (!API_KEY) throw new Error('BREVO_API_KEY is not configured');
    if (!transactionalApi) {
        transactionalApi = new TransactionalEmailsApi();
        transactionalApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, API_KEY);
    }
    return transactionalApi;
}

function getContactsApi() {
    if (!API_KEY) throw new Error('BREVO_API_KEY is not configured');
    const api = new ContactsApi();
    api.setApiKey(ContactsApiApiKeys.apiKey, API_KEY);
    return api;
}

/**
 * Standard response format for all email methods
 * @param {boolean} success
 * @param {string|null} messageId
 * @param {string|null} error
 */
function createResponse(success, messageId = null, error = null) {
    return { success, messageId, error };
}

/**
 * Send welcome email with 10% discount code (newsletter subscription)
 */
export async function sendWelcomeEmail(email, firstName) {
    try {
        const api = getTransactionalApi();
        const result = await api.sendTransacEmail({
            subject: 'Welcome to Customise Me UK! 10% Off Your First Order',
            sender: { name: SENDER_NAME, email: SENDER_EMAIL },
            to: [{ email, name: firstName }],
            htmlContent: getWelcomeEmailHtml(firstName, 'WELCOME10'),
            textContent: `Hi ${firstName}, welcome! Use code WELCOME10 for 10% off. Shop at ${BASE_URL}/shop`
        });
        return createResponse(true, result.body?.messageId || null);
    } catch (err) {
        const msg = err?.response?.body?.message || err?.message || 'Unknown error';
        console.error('[EmailService] sendWelcomeEmail failed:', { email, error: msg });
        return createResponse(false, null, msg);
    }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(orderData) {
    try {
        const { email, firstName, orderNumber, orderDate, orderTotal, itemsHtml, shippingAddress, trackingLink } =
            orderData;

        const api = getTransactionalApi();
        const result = await api.sendTransacEmail({
            subject: `Order Confirmed: ${orderNumber}`,
            sender: { name: SENDER_NAME, email: SENDER_EMAIL },
            to: [{ email, name: firstName || 'Customer' }],
            htmlContent: getOrderConfirmationHtml({
                firstName: firstName || 'there',
                orderNumber,
                orderDate,
                orderTotal,
                itemsHtml,
                shippingAddress,
                trackingLink: trackingLink || `${BASE_URL}/order-tracking`
            })
        });
        return createResponse(true, result.body?.messageId || null);
    } catch (err) {
        const msg = err?.response?.body?.message || err?.message || 'Unknown error';
        console.error('[EmailService] sendOrderConfirmation failed:', { email: orderData?.email, error: msg });
        return createResponse(false, null, msg);
    }
}

/**
 * Send shipping notification with tracking
 */
export async function sendShippingNotification(shippingData) {
    try {
        const { email, firstName, orderNumber, trackingNumber, carrier, estimatedDelivery } = shippingData;

        const api = getTransactionalApi();
        const result = await api.sendTransacEmail({
            subject: `Your Order ${orderNumber} Has Been Shipped!`,
            sender: { name: SENDER_NAME, email: SENDER_EMAIL },
            to: [{ email, name: firstName || 'Customer' }],
            htmlContent: getShippingNotificationHtml({
                firstName: firstName || 'there',
                orderNumber,
                trackingNumber: trackingNumber || 'Will be updated shortly',
                carrier: carrier || 'Royal Mail',
                estimatedDelivery: estimatedDelivery || '3-5 business days'
            })
        });
        return createResponse(true, result.body?.messageId || null);
    } catch (err) {
        const msg = err?.response?.body?.message || err?.message || 'Unknown error';
        console.error('[EmailService] sendShippingNotification failed:', { email: shippingData?.email, error: msg });
        return createResponse(false, null, msg);
    }
}

/**
 * Send account welcome email
 */
export async function sendAccountWelcome(userData) {
    try {
        const { email, firstName } = userData;

        const api = getTransactionalApi();
        const result = await api.sendTransacEmail({
            subject: 'Welcome to Customise Me UK — Account Created',
            sender: { name: SENDER_NAME, email: SENDER_EMAIL },
            to: [{ email, name: firstName || 'Customer' }],
            htmlContent: getAccountWelcomeHtml({
                firstName: firstName || 'there',
                email,
                accountLink: `${BASE_URL}/account`
            })
        });
        return createResponse(true, result.body?.messageId || null);
    } catch (err) {
        const msg = err?.response?.body?.message || err?.message || 'Unknown error';
        console.error('[EmailService] sendAccountWelcome failed:', { email: userData?.email, error: msg });
        return createResponse(false, null, msg);
    }
}

/**
 * Send password reset email with time-limited link
 */
export async function sendPasswordReset(email, firstName, resetToken) {
    try {
        const resetLink = `${BASE_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;

        const api = getTransactionalApi();
        const result = await api.sendTransacEmail({
            subject: 'Reset Your Password - Customise Me UK',
            sender: { name: SENDER_NAME, email: SENDER_EMAIL },
            to: [{ email, name: firstName || 'Customer' }],
            htmlContent: getPasswordResetHtml({
                firstName: firstName || 'there',
                resetLink,
                expiryTime: '1 hour'
            })
        });
        return createResponse(true, result.body?.messageId || null);
    } catch (err) {
        const msg = err?.response?.body?.message || err?.message || 'Unknown error';
        console.error('[EmailService] sendPasswordReset failed:', { email, error: msg });
        return createResponse(false, null, msg);
    }
}

/**
 * Add contact to Brevo newsletter list (and optionally send welcome email)
 */
export async function addToNewsletter(email, firstName, lastName = '') {
    try {
        const contactsApi = getContactsApi();
        const createContact = {
            email,
            attributes: { FIRSTNAME: firstName, LASTNAME: lastName || '' },
            listIds: [NEWSLETTER_LIST_ID],
            updateEnabled: true
        };

        await contactsApi.createContact(createContact);
        return createResponse(true, 'contact_created');
    } catch (err) {
        if (err?.response?.body?.code === 'duplicate_parameter') {
            try {
                const contactsApi = getContactsApi();
                await contactsApi.updateContact(email, {
                    attributes: { FIRSTNAME: firstName, LASTNAME: lastName || '' },
                    listIds: [NEWSLETTER_LIST_ID]
                });
                return createResponse(true, 'contact_updated');
            } catch (upErr) {
                const msg = upErr?.response?.body?.message || upErr?.message || 'Update failed';
                console.error('[EmailService] addToNewsletter update failed:', { email, error: msg });
                return createResponse(false, null, msg);
            }
        }
        const msg = err?.response?.body?.message || err?.message || 'Unknown error';
        console.error('[EmailService] addToNewsletter failed:', { email, error: msg });
        return createResponse(false, null, msg);
    }
}

/**
 * Add customer to Brevo Customers list (after purchase)
 * Tag as VIP if order total > £500
 */
export async function addToCustomerList(email, firstName, lastName = '', orderData = {}) {
    try {
        const contactsApi = getContactsApi();
        const total = Number(orderData.total || 0);
        const isVip = total >= 500;

        const createContact = {
            email,
            attributes: {
                FIRSTNAME: firstName || '',
                LASTNAME: lastName || '',
                ...(orderData.lastPurchaseDate && { LAST_PURCHASE_DATE: orderData.lastPurchaseDate })
            },
            listIds: [CUSTOMERS_LIST_ID],
            updateEnabled: true,
            ...(isVip && { tags: ['VIP'] })
        };

        await contactsApi.createContact(createContact);
        return createResponse(true, 'contact_created');
    } catch (err) {
        if (err?.response?.body?.code === 'duplicate_parameter') {
            try {
                const contactsApi = getContactsApi();
                await contactsApi.updateContact(email, {
                    attributes: {
                        FIRSTNAME: firstName || '',
                        LASTNAME: lastName || '',
                        ...(orderData.lastPurchaseDate && { LAST_PURCHASE_DATE: orderData.lastPurchaseDate })
                    },
                    listIds: [CUSTOMERS_LIST_ID]
                });
                return createResponse(true, 'contact_updated');
            } catch (upErr) {
                const msg = upErr?.response?.body?.message || upErr?.message || 'Update failed';
                console.error('[EmailService] addToCustomerList update failed:', { email, error: msg });
                return createResponse(false, null, msg);
            }
        }
        const msg = err?.response?.body?.message || err?.message || 'Unknown error';
        console.error('[EmailService] addToCustomerList failed:', { email, error: msg });
        return createResponse(false, null, msg);
    }
}

// --- HTML Email Templates ---

function getEmailWrapper(content, includeUnsubscribe = true) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .email-container { max-width: 600px; margin: 20px auto; background: #fff; }
        .email-header { text-align: center; padding: 30px 20px; background: #000; color: #fff; }
        .email-header h1 { margin: 0; letter-spacing: 3px; font-size: 24px; }
        .email-content { padding: 30px 20px; }
        .email-footer { text-align: center; font-size: 0.8em; color: #999; padding: 20px; border-top: 1px solid #eee; background: #fafafa; }
        .btn { display: inline-block; padding: 14px 28px; background: #000; color: #fff !important; text-decoration: none; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; font-size: 14px; border-radius: 0; }
        .code-box { background: #f9f9f9; padding: 20px; text-align: center; margin: 25px 0; border: 2px dashed #000; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header"><h1>CUSTOMISE ME UK</h1></div>
        <div class="email-content">${content}</div>
        <div class="email-footer">
            <p>Customise Me UK | Premium Designs & Bespoke Merch</p>
            <p>info@customisemeuk.com | 07588770901</p>
            <p>© 2026 Customise Me UK. All rights reserved.</p>
            ${includeUnsubscribe ? `<p><a href="${BASE_URL}/unsubscribe" style="color:#999">Unsubscribe</a> from marketing emails</p>` : ''}
        </div>
    </div>
</body>
</html>`;
}

function getWelcomeEmailHtml(firstName, discountCode) {
    const content = `
        <h2 style="margin-top:0">Welcome to Customise Me UK!</h2>
        <p>Hi ${escapeHtml(firstName)},</p>
        <p>Thank you for subscribing. You're now part of our community and will be the first to know about new products, exclusive discounts, and early access to sales.</p>
        <div class="code-box">
            <p style="margin:0 0 5px 0; font-weight:bold">YOUR WELCOME DISCOUNT</p>
            <p style="font-size:2em; font-weight:bold; margin:10px 0; letter-spacing:3px">${escapeHtml(discountCode)}</p>
            <p style="margin:0; color:#666">Use this code for 10% off your first order</p>
        </div>
        <p style="text-align:center; margin-top:30px">
            <a href="${BASE_URL}/shop" class="btn">SHOP NOW</a>
        </p>
    `;
    return getEmailWrapper(content, true);
}

function getOrderConfirmationHtml({ firstName, orderNumber, orderDate, orderTotal, itemsHtml, shippingAddress, trackingLink }) {
    const content = `
        <h2 style="margin-top:0">Thank you for your order!</h2>
        <p>Hi ${escapeHtml(firstName)},</p>
        <p>We've received your payment and our team is preparing your custom items. You'll receive another email once your order has shipped.</p>
        <div style="background:#f9f9f9; padding:15px; margin:20px 0">
            <strong>Order Number:</strong> ${escapeHtml(orderNumber)}<br>
            <strong>Date:</strong> ${escapeHtml(orderDate)}
        </div>
        <h3>Items</h3>
        <table style="width:100%; border-collapse:collapse">
            <thead><tr><th style="text-align:left; border-bottom:1px solid #eee">Item</th><th style="text-align:center; border-bottom:1px solid #eee">Qty</th><th style="text-align:right; border-bottom:1px solid #eee">Price</th></tr></thead>
            <tbody>${itemsHtml || ''}</tbody>
        </table>
        <div style="margin-top:20px; border-top:2px solid #eee; padding-top:10px">
            <div style="display:flex; justify-content:space-between; font-size:1.2em; font-weight:bold">
                <span>TOTAL:</span>
                <span>${escapeHtml(orderTotal)}</span>
            </div>
        </div>
        <div style="margin-top:30px">
            <h3>Shipping To</h3>
            <p>${escapeHtml(shippingAddress || '—')}</p>
        </div>
        <p style="text-align:center; margin-top:30px">
            <a href="${escapeHtml(trackingLink)}" class="btn">VIEW ORDER STATUS</a>
        </p>
    `;
    return getEmailWrapper(content, false);
}

function getShippingNotificationHtml({ firstName, orderNumber, trackingNumber, carrier, estimatedDelivery }) {
    const content = `
        <h2 style="margin-top:0">Your Order Has Been Shipped!</h2>
        <p>Hi ${escapeHtml(firstName)},</p>
        <p>Great news! Your order <strong>${escapeHtml(orderNumber)}</strong> is on its way.</p>
        <div style="background:#f9f9f9; padding:15px; margin:20px 0">
            <strong>Tracking Number:</strong> ${escapeHtml(trackingNumber)}<br>
            <strong>Carrier:</strong> ${escapeHtml(carrier)}<br>
            <strong>Estimated Delivery:</strong> ${escapeHtml(estimatedDelivery)}
        </div>
        <p style="text-align:center; margin-top:30px">
            <a href="${BASE_URL}/order-tracking" class="btn">TRACK YOUR ORDER</a>
        </p>
    `;
    return getEmailWrapper(content, false);
}

function getAccountWelcomeHtml({ firstName, email, accountLink }) {
    const content = `
        <h2 style="margin-top:0">Welcome to Customise Me UK!</h2>
        <p>Hi ${escapeHtml(firstName)},</p>
        <p>Your account has been created successfully. You can now track orders, save wishlists, and access exclusive member offers.</p>
        <p style="text-align:center; margin-top:30px">
            <a href="${escapeHtml(accountLink)}" class="btn">GO TO YOUR ACCOUNT</a>
        </p>
    `;
    return getEmailWrapper(content, false);
}

function getPasswordResetHtml({ firstName, resetLink, expiryTime }) {
    const content = `
        <h2 style="margin-top:0">Password Reset Request</h2>
        <p>Hi ${escapeHtml(firstName)},</p>
        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <p style="text-align:center; margin:30px 0">
            <a href="${escapeHtml(resetLink)}" class="btn">RESET YOUR PASSWORD</a>
        </p>
        <p style="color:#666; font-size:0.9em">This link will expire in ${escapeHtml(expiryTime)}.</p>
    `;
    return getEmailWrapper(content, false);
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
