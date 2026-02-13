import { httpsCallable } from 'firebase/functions';
import { auth, functions } from './firebase';

export const CheckoutService = {
    /**
     * Creates a Stripe Checkout Session and returns the hosted URL
     * @param {Object} orderData { items, email, shippingAddress, successUrl, cancelUrl }
     */
    async createCheckoutSession(orderData) {
        try {
            const createCheckoutSessionFn = httpsCallable(functions, 'createCheckoutSession');
            const user = auth.currentUser;

            const result = await createCheckoutSessionFn({
                ...orderData,
                userId: user ? user.uid : null,
                successUrl: orderData.successUrl || window.location.origin + '/order-confirmation',
                cancelUrl: orderData.cancelUrl || window.location.origin + '/checkout'
            });

            return result.data; // Expected { url }
        } catch (error) {
            console.error('Checkout session error:', error);
            throw error;
        }
    }
};
