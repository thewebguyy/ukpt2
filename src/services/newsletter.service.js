import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Encode email to be safe as a Firestore document ID
function emailToDocId(email) {
    return email.toLowerCase().replace(/[.#$[\]/]/g, '_');
}

export const NewsletterService = {
    async subscribe(email) {
        try {
            const docRef = doc(db, 'newsletter', emailToDocId(email));
            await setDoc(docRef, {
                email: email.toLowerCase(),
                createdAt: serverTimestamp(),
                source: 'react_website_footer'
            }, { merge: true });

            return { success: true, message: 'Successfully subscribed!' };
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            return { success: false, message: 'Failed to subscribe. Please try again later.' };
        }
    }
};
