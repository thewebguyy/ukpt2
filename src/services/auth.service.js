import {
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export const AuthService = {
    async register({ email, password, name }) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: name });

            // Send verification email
            await sendEmailVerification(user, {
                url: window.location.origin + '/account',
                handleCodeInApp: false
            });

            // Sign out user until verified
            await signOut(auth);

            // Create user doc in Firestore
            try {
                await setDoc(doc(db, 'users', user.uid), {
                    name,
                    email,
                    createdAt: serverTimestamp()
                }, { merge: true });
            } catch (e) {
                console.error('Firestore user doc creation error:', e);
            }

            return {
                success: true,
                message: 'Account created! Please check your email to verify before logging in.'
            };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: this.getErrorMessage(error) };
        }
    },

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                await signOut(auth);
                return {
                    success: false,
                    message: 'Please verify your email address before logging in.',
                    needsVerification: true
                };
            }

            return { success: true, user: this.formatUser(user) };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: this.getErrorMessage(error) };
        }
    },

    async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            return { success: true, user: this.formatUser(result.user) };
        } catch (error) {
            console.error('Google login error:', error);
            return { success: false, message: this.getErrorMessage(error) };
        }
    },

    async logout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    formatUser(user) {
        if (!user) return null;
        return {
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'User',
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
        };
    },

    initAuthListener(callback) {
        return onAuthStateChanged(auth, (user) => {
            callback(user ? this.formatUser(user) : null);
        });
    },

    async sendPasswordReset(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true, message: 'Password reset email sent! Please check your inbox.' };
        } catch (error) {
            console.error('Password reset error:', error);
            return { success: false, message: this.getErrorMessage(error) };
        }
    },

    getErrorMessage(error) {
        switch (error.code) {
            case 'auth/user-not-found': return 'No account found with this email.';
            case 'auth/wrong-password': return 'Incorrect password.';
            case 'auth/email-already-in-use': return 'Email is already registered.';
            case 'auth/weak-password': return 'Password should be at least 6 characters.';
            default: return error.message;
        }
    }
};
