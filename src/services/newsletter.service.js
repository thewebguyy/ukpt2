import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export const NewsletterService = {
    async subscribe(emailOrData) {
        const data = typeof emailOrData === 'string' ? { email: emailOrData } : emailOrData;
        if (!data?.email) return { success: false, message: 'Email is required.' };

        try {
            const subscribeFn = httpsCallable(functions, 'subscribeNewsletter');
            const result = await subscribeFn(data);
            return result.data;
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            return { success: false, message: error.message || 'Failed to subscribe.' };
        }
    },

    async unsubscribe(email) {
        if (!email) return { success: false, message: 'Email is required.' };
        try {
            const unsubscribeFn = httpsCallable(functions, 'unsubscribeNewsletter');
            const result = await unsubscribeFn({ email });
            return result.data;
        } catch (error) {
            console.error('Newsletter unsubscribe error:', error);
            return { success: false, message: error.message || 'Failed to unsubscribe.' };
        }
    }
};
