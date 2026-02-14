// Client-side admin email whitelist for UI gating only.
// IMPORTANT: All admin write operations (product deletion, order updates, etc.)
// MUST also be enforced server-side via Firestore Security Rules or Cloud Functions.
// This list alone does NOT provide real security.
export const ADMIN_EMAILS = ['info@customisemeuk.com', 'pstman2003@gmail.com'];
