/**
 * Frontend service to call the Brevo Email API (Express backend)
 * Used when VITE_EMAIL_API_URL is configured
 */

const API_BASE = import.meta.env.VITE_EMAIL_API_URL || '';

function getUrl(path) {
    return `${API_BASE.replace(/\/$/, '')}${path}`;
}

async function post(path, body) {
    const res = await fetch(getUrl(path), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.message || data.error || `Request failed: ${res.status}`);
    }
    return data;
}

export const EmailApiService = {
    /**
     * Subscribe to newsletter - adds to Brevo list and sends welcome email
     */
    async subscribe({ email, firstName, lastName }) {
        return post('/api/email/subscribe', { email, firstName, lastName: lastName || '' });
    },

    /**
     * Send order confirmation (typically called by webhook, but can be used by frontend)
     */
    async sendOrderConfirmation(orderData) {
        return post('/api/email/order-confirmation', orderData);
    },

    /**
     * Send shipping notification
     */
    async sendShippingNotification(data) {
        return post('/api/email/shipping-notification', data);
    },

    /**
     * Send account welcome email
     */
    async sendAccountWelcome({ email, firstName }) {
        return post('/api/email/account-welcome', { email, firstName });
    },

    /**
     * Send password reset email
     */
    async sendPasswordReset({ email, firstName, resetToken }) {
        return post('/api/email/password-reset', { email, firstName, resetToken });
    },

    isConfigured() {
        return Boolean(API_BASE);
    }
};
