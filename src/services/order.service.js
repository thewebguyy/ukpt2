import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';

export const OrderService = {
    async getUserOrders(email) {
        const user = auth.currentUser;
        if (!email && !user) return [];

        try {
            const ordersRef = collection(db, 'orders');
            let orders = [];

            if (user) {
                // Query by userId
                const q = query(ordersRef, where('userId', '==', user.uid));
                const snapshot = await getDocs(q);
                snapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));
            }

            // If we have email or no user orders yet, supplement with email query
            if (email) {
                const q2 = query(ordersRef, where('email', '==', email));
                const snapshot2 = await getDocs(q2);
                snapshot2.forEach(doc => {
                    if (!orders.find(o => o.id === doc.id)) {
                        orders.push({ id: doc.id, ...doc.data() });
                    }
                });
            }

            // Convert Firestore Timestamps to ISO strings so they survive serialization
            orders = orders.map(order => ({
                ...order,
                createdAt: order.createdAt?.toDate ? order.createdAt.toDate().toISOString() : order.createdAt || null
            }));

            return orders.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt) : 0;
                const dateB = b.createdAt ? new Date(b.createdAt) : 0;
                return dateB - dateA;
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    }
};
