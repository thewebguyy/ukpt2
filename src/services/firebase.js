import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA6pLJdRb4V5LUUrHdwSKRne-ZgXJoqqY8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cmuksite.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cmuksite",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cmuksite.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "311601861870",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:311601861870:web:4d3c04c418a789961dcfff"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

export default app;
