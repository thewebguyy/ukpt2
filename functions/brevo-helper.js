/**
 * Brevo API helper for Firebase Functions - uses REST API to avoid ESM/CommonJS issues
 */

const BREVO_API_URL = 'https://api.brevo.com/v3';
const BASE_URL = 'https://customisemeuk.com';

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Send a transactional email via Brevo REST API
 */
async function sendTransactionalEmail(apiKey, { to, subject, htmlContent, textContent }, senderEmail = 'noreply@customisemeuk.com') {
    const res = await fetch(`${BREVO_API_URL}/smtp/email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey
        },
        body: JSON.stringify({
            sender: { name: 'Customise Me UK', email: senderEmail },
            to: Array.isArray(to) ? to : [{ email: to, name: to }],
            subject,
            htmlContent: htmlContent || '',
            textContent: textContent || ''
        })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.message || data.code || `Brevo API error: ${res.status}`);
    }
    return data.messageId;
}

/**
 * Add a contact to a Brevo list
 */
async function addContactToList(apiKey, { email, firstName, lastName, listIds }) {
    const res = await fetch(`${BREVO_API_URL}/contacts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey
        },
        body: JSON.stringify({
            email,
            attributes: {
                FIRSTNAME: firstName || '',
                LASTNAME: lastName || ''
            },
            listIds: listIds || [],
            updateEnabled: true
        })
    });

    const data = await res.json().catch(() => ({}));
    // 400 with 'duplicate_parameter' is fine, it means contact already exists and updateEnabled:true handled it
    if (!res.ok && data.code !== 'duplicate_parameter') {
        throw new Error(data.message || data.code || `Brevo API error: ${res.status}`);
    }
    return data;
}

module.exports = {
    sendTransactionalEmail,
    addContactToList,

    // High-level wrappers that can take pre-rendered HTML
    async sendWelcomeEmail(apiKey, email, firstName = '', lastName = '', senderEmail = 'noreply@customisemeuk.com', htmlContent = null) {
        const name = (firstName || '').trim() || 'there';
        // Add to newsletter list (List ID 2 as per EMAIL_SYSTEM.md)
        try {
            await addContactToList(apiKey, { email, firstName: name, lastName, listIds: [2] });
        } catch (err) {
            console.error('Failed to add contact to Brevo list:', err.message);
        }

        return sendTransactionalEmail(apiKey, {
            to: [{ email, name }],
            subject: 'Welcome to Customise Me UK! 10% Off Your First Order',
            htmlContent: htmlContent || `<h3>Welcome ${name}!</h3><p>Use code WELCOME10 for 10% off.</p>`
        }, senderEmail);
    },

    async sendOrderConfirmation(apiKey, order, orderId, senderEmail = 'noreply@customisemeuk.com', htmlContent = null) {
        // Add to customers list (List ID 3 as per EMAIL_SYSTEM.md)
        const firstName = order.shippingAddress?.name?.split(' ')[0] || 'Customer';
        const lastName = order.shippingAddress?.name?.split(' ').slice(1).join(' ') || '';

        try {
            await addContactToList(apiKey, {
                email: order.email,
                firstName,
                lastName,
                listIds: [3]
            });
        } catch (err) {
            console.error('Failed to add customer to Brevo list:', err.message);
        }

        return sendTransactionalEmail(apiKey, {
            to: [{ email: order.email, name: (order.shippingAddress?.name || 'Customer') }],
            subject: `Order Confirmed: ${orderId}`,
            htmlContent: htmlContent || `<h3>Order Confirmed!</h3><p>Order ID: ${orderId}</p>`
        }, senderEmail);
    },

    async sendShippingNotification(apiKey, { email, firstName, orderId, trackingNumber, carrier, estimatedDelivery }, senderEmail = 'noreply@customisemeuk.com', htmlContent = null) {
        return sendTransactionalEmail(apiKey, {
            to: [{ email, name: firstName || 'Customer' }],
            subject: `Your Order ${orderId} Has Been Shipped!`,
            htmlContent: htmlContent || `<h3>Your order ${orderId} has been shipped!</h3>`
        }, senderEmail);
    },

    async sendAccountWelcome(apiKey, { email, name }, senderEmail = 'noreply@customisemeuk.com', htmlContent = null) {
        return sendTransactionalEmail(apiKey, {
            to: [{ email, name: name || 'Customer' }],
            subject: 'Welcome to Customise Me UK — Account Created',
            htmlContent: htmlContent || `<h3>Account Created! Welcome ${name}.</h3>`
        }, senderEmail);
    }
};
