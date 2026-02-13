import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [],

            toggleItem: (product) => {
                const items = get().items;
                const index = items.findIndex(item => item.id === product.id);

                if (index > -1) {
                    set({ items: items.filter(item => item.id !== product.id) });
                } else {
                    set({ items: [...items, product] });
                }
            },

            isInWishlist: (productId) => {
                return get().items.some(item => item.id === productId);
            }
        }),
        {
            name: 'cmuk-wishlist-storage'
        }
    )
);
