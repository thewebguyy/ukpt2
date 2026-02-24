import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [], // These will now be product IDs only

            toggleItem: (product) => {
                const productId = typeof product === 'string' ? product : product.id;
                const items = get().items;
                const exists = items.includes(productId);

                if (exists) {
                    set({ items: items.filter(id => id !== productId) });
                } else {
                    set({ items: [...items, productId] });
                }
            },

            isInWishlist: (productId) => {
                return get().items.includes(productId);
            }
        }),
        {
            name: 'cmuk-wishlist-storage'
        }
    )
);
