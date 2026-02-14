import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { EmailService } from './email.service';

// Encode email to be safe as a Firestore document ID
function emailToDocId(email) {
    return email.toLowerCase().replace(/[.#$[\]/]/g, '_');
}

export const NewsletterService = {
    async subscribe(emailOrData) {
        const email = typeof emailOrData === 'string' ? emailOrData : emailOrData?.email;
        const firstName = typeof emailOrData === 'object' ? emailOrData?.firstName : '';
        if (!email) return { success: false, message: 'Email is required.' };

        try {
            const docRef = doc(db, 'newsletter', emailToDocId(email));
            await setDoc(docRef, {
                email: email.toLowerCase(),
                firstName: firstName || '',
                createdAt: serverTimestamp(),
                source: 'react_website_footer',
                subscribed: true
            }, { merge: true });

            // Send welcome email (fire and forget) - Firebase function uses Brevo
            EmailService.sendWelcomeEmail(email.toLowerCase(), firstName);

            return { success: true, message: 'Successfully subscribed!' };
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            return { success: false, message: 'Failed to subscribe. Please try again later.' };
        }
    },

    async unsubscribe(email) {
        try {
            const docRef = doc(db, 'newsletter', emailToDocId(email));
            await setDoc(docRef, {
                subscribed: false,
                unsubscribedAt: serverTimestamp()
            }, { merge: true });

            return { success: true, message: 'Successfully unsubscribed.' };
        } catch (error) {
            console.error('Newsletter unsubscribe error:', error);
            return { success: false, message: 'Failed to unsubscribe. Please try again.' };
        }
    }
};
