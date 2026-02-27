import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    limit,
    orderBy,
    startAfter,
    addDoc
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from './firebase';

export const ProductService = {
    async getProducts(filters = {}) {
        try {
            let productsRef = collection(db, 'products');
            let q = query(productsRef);

            if (filters.category && filters.category !== 'all') {
                q = query(q, where('categories', 'array-contains', filters.category));
            }

            if (filters.featured) {
                q = query(q, where('featured', '==', true));
            }

            if (filters.orderByField) {
                const direction = filters.orderDirection || 'asc';
                q = query(q, orderBy(filters.orderByField, direction));
            }

            if (filters.startAfterDoc) {
                q = query(q, startAfter(filters.startAfterDoc));
            }

            // TECH-002: Move price filtering to server-side query
            if (filters.minPrice) {
                q = query(q, where('price', '>=', parseFloat(filters.minPrice)));
            }

            if (filters.maxPrice) {
                q = query(q, where('price', '<=', parseFloat(filters.maxPrice)));
            }

            if (filters.search) {
                // Fetch more results to make client-side search effective for common terms
                q = query(q, limit(100));
            } else {
                const limitCount = filters.limit || 50;
                q = query(q, limit(limitCount));
            }

            const querySnapshot = await getDocs(q);
            let products = [];

            querySnapshot.forEach((doc) => {
                products.push(this.formatProduct(doc));
            });

            // TECH-002: Client-side search (limited by the fetch above)
            if (filters.search) {
                const term = filters.search.toLowerCase();
                products = products.filter(p =>
                    p.name.toLowerCase().includes(term) ||
                    (p.description && p.description.toLowerCase().includes(term))
                );
            }

            return products;
        } catch (error) {
            console.error('getProducts error:', error);
            return [];
        }
    },

    async getProduct(id) {
        try {
            const docRef = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? this.formatProduct(docSnap) : null;
        } catch (error) {
            console.error('getProduct error:', error);
            return null;
        }
    },

    async getFeaturedProducts() {
        const featured = await this.getProducts({ featured: true, limit: 4 });
        if (featured.length > 0) return featured;

        // Fallback: If no products are marked as featured, return the 4 most recent ones
        return this.getProducts({ featured: false, limit: 4 });
    },

    async getReviews(productId) {
        try {
            const reviewsRef = collection(db, 'products', productId, 'reviews');
            const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(10));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
    },

    async addReview(reviewData) {
        try {
            const addReviewFn = httpsCallable(functions, 'addReview');
            const result = await addReviewFn(reviewData);
            return result.data;
        } catch (error) {
            console.error('Add review error:', error);
            return { success: false, message: error.message };
        }
    },

    formatProduct(doc) {
        if (!doc.exists()) return null;
        const data = doc.data();

        // Deep clean to convert Firestore Timestamps to ISO strings for serialization
        const cleanData = (obj) => {
            if (!obj || typeof obj !== 'object') return obj;
            if (typeof obj.toDate === 'function') return obj.toDate().toISOString();

            if (Array.isArray(obj)) return obj.map(cleanData);

            const newObj = {};
            for (const key in obj) {
                newObj[key] = cleanData(obj[key]);
            }
            return newObj;
        };

        const cleaned = cleanData(data);

        return {
            ...cleaned,
            id: doc.id,
            category: Array.isArray(data.categories) ? data.categories[0] : (data.category || 'Uncategorized'),
            imageUrl: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : (data.imageUrl || ''),
            stock: typeof data.stock === 'number' ? data.stock : 0
        };
    }
};
