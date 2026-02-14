import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export const EmailService = {
    /**
     * Send welcome email when user subscribes to newsletter
     */
    async sendWelcomeEmail(email) {
        try {
            const sendEmail = httpsCallable(functions, 'sendWelcomeEmail');
            const result = await sendEmail({ email });
            return result.data;
        } catch (error) {
            console.error('Welcome email error:', error);
            // Don't throw - newsletter subscription shouldn't fail because of email
            return { success: false };
        }
    },

    /**
     * Send order confirmation email after successful checkout
     */
    async sendOrderConfirmation({ email, orderId, items, total, shippingAddress }) {
        try {
            const sendEmail = httpsCallable(functions, 'sendOrderConfirmation');
            const result = await sendEmail({ email, orderId, items, total, shippingAddress });
            return result.data;
        } catch (error) {
            console.error('Order confirmation email error:', error);
            return { success: false };
        }
    },

    /**
     * Send shipping notification when order status changes to shipped
     */
    async sendShippingNotification({ email, orderId, trackingNumber, carrier, estimatedDelivery }) {
        try {
            const sendEmail = httpsCallable(functions, 'sendShippingNotification');
            const result = await sendEmail({ email, orderId, trackingNumber, carrier, estimatedDelivery });
            return result.data;
        } catch (error) {
            console.error('Shipping notification email error:', error);
            return { success: false };
        }
    },

    /**
     * Send account creation welcome email
     */
    async sendAccountCreationEmail({ email, name }) {
        try {
            const sendEmail = httpsCallable(functions, 'sendAccountCreationEmail');
            const result = await sendEmail({ email, name });
            return result.data;
        } catch (error) {
            console.error('Account creation email error:', error);
            return { success: false };
        }
    },

    /**
     * Send contact inquiry confirmation
     */
    async sendContactConfirmation({ email, name, subject, message }) {
        try {
            const sendEmail = httpsCallable(functions, 'sendContactConfirmation');
            const result = await sendEmail({ email, name, subject, message });
            return result.data;
        } catch (error) {
            console.error('Contact confirmation email error:', error);
            return { success: false };
        }
    },

    /**
     * Send newsletter campaign (admin only)
     */
    async sendNewsletterCampaign({ subject, htmlContent, textContent }) {
        try {
            const sendCampaign = httpsCallable(functions, 'sendNewsletterCampaign');
            const result = await sendCampaign({ subject, htmlContent, textContent });
            return result.data;
        } catch (error) {
            console.error('Newsletter campaign error:', error);
            throw error;
        }
    },

    /**
     * Unsubscribe from newsletter
     */
    async unsubscribe(email) {
        try {
            const unsubscribeFn = httpsCallable(functions, 'unsubscribeNewsletter');
            const result = await unsubscribeFn({ email });
            return result.data;
        } catch (error) {
            console.error('Unsubscribe error:', error);
            throw error;
        }
    }
};
