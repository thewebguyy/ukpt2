import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

let syncTimer = null;

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, customization = {}, quantity = 1) => {
                const items = get().items;
                // Create a unique key for the item based on ID and customization
                const customizationKey = JSON.stringify(customization);
                const existingItemIndex = items.findIndex(
                    (item) => item.product.id === product.id && JSON.stringify(item.customization) === customizationKey
                );

                // Strip any remaining non-serializable fields from product just in case
                const cleanProduct = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    category: product.category,
                    hasBulkPricing: product.hasBulkPricing || false,
                    bulkPricing: product.bulkPricing || []
                };

                if (existingItemIndex > -1) {
                    const newItems = [...items];
                    newItems[existingItemIndex].quantity += quantity;
                    set({ items: newItems });
                } else {
                    set({ items: [...items, { product: cleanProduct, customization, quantity, addedAt: new Date().toISOString() }] });
                }

                get().syncWithFirestore();
            },

            removeAt: (index) => {
                const newItems = get().items.filter((_, i) => i !== index);
                set({ items: newItems });
                get().syncWithFirestore();
            },

            updateQuantity: (index, quantity) => {
                if (quantity < 1) return;
                const newItems = [...get().items];
                newItems[index].quantity = quantity;
                set({ items: newItems });
                get().syncWithFirestore();
            },

            clearCart: () => {
                set({ items: [] });
                get().syncWithFirestore();
            },

            syncWithFirestore: async () => {
                const user = auth.currentUser;
                if (!user) return;

                if (syncTimer) {
                    clearTimeout(syncTimer);
                }

                syncTimer = setTimeout(async () => {
                    try {
                        const cartRef = doc(db, 'carts', user.uid);
                        await setDoc(cartRef, {
                            items: get().items,
                            userId: user.uid,
                            email: user.email,
                            status: 'active',
                            updatedAt: serverTimestamp()
                        }, { merge: true });
                        syncTimer = null;
                    } catch (e) {
                        console.error("Failed to sync cart to Firestore", e);
                    }
                }, 1000);
            }
        }),
        {
            name: 'cmuk-cart-storage',
            // Ensure timer isn't accidentally persisted if someone put it back in state
            partialize: (state) => {
                const { syncTimer: _, ...rest } = state;
                return rest;
            }
        }
    )
);
