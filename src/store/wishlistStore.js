import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [], // These will now be product IDs only

            toggleItem: (product) => {
                const items = get().items;
                // Handle both object and string items for legacy support
                const exists = items.some(item => (typeof item === 'string' ? item : item.id) === product.id);

                if (exists) {
                    set({ items: items.filter(item => (typeof item === 'string' ? item : item.id) !== product.id) });
                } else {
                    set({ items: [...items, product] });
                }
            },

            isInWishlist: (productId) => {
                return get().items.some(item => (typeof item === 'string' ? item : item.id) === productId);
            }
        }),
        {
            name: 'cmuk-wishlist-storage'
        }
    )
);
