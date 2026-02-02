const admin = require('firebase-admin');

// Note: You must have serviceAccountKey.json in the same folder
// Download from: Firebase Console > Project Settings > Service Accounts
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// REPLACE WITH YOUR FIREBASE USER UID (Found in Authentication tab)
const ADMIN_UID = 'YOUR_FIREBASE_USER_UID_HERE';
const ADMIN_EMAIL = 'admin@customisemeuk.com';

db.collection('admins').doc(ADMIN_UID).set({
    role: 'admin',
    email: ADMIN_EMAIL,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
}).then(() => {
    console.log('✅ Admin created successfully');
    process.exit(0);
}).catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
