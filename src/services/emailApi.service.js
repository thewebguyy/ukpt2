import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

/**
 * Frontend service to call Firebase Functions for emails
 * Refactored to eliminate direct fetch calls to external APIs
 */

const callEmailFunction = async (name, data) => {
    try {
        const fn = httpsCallable(functions, name);
        const result = await fn(data);
        return result.data;
    } catch (error) {
        console.error(`Email function error (${name}):`, error);
        return { success: false, message: error.message };
    }
};

export const EmailApiService = {
    /**
     * Subscribe to newsletter - adds to Brevo list via Firebase function
     */
    async subscribe({ email, firstName, lastName }) {
        return callEmailFunction('subscribeNewsletter', { email, firstName, lastName: lastName || '' });
    },

    /**
     * Send order confirmation via Firebase function
     */
    async sendOrderConfirmation(orderData) {
        return callEmailFunction('sendOrderConfirmation', orderData);
    },

    /**
     * Send shipping notification via Firebase function
     */
    async sendShippingNotification(data) {
        return callEmailFunction('sendShippingNotification', data);
    },

    /**
     * Send account welcome email via Firebase function
     */
    async sendAccountWelcome({ email, firstName }) {
        return callEmailFunction('sendAccountWelcome', { email, firstName });
    },

    /**
     * Send password reset email via Firebase function
     */
    async sendPasswordReset({ email, firstName, resetToken }) {
        return callEmailFunction('sendPasswordReset', { email, firstName, resetToken });
    },

    isConfigured() {
        // Now consistently using Firebase Functions
        return true;
    }
};
