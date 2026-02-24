import React from 'react';
import { useWishlistStore } from '../../store/wishlistStore';
import WishlistGrid from './WishlistGrid';
import WishlistEmpty from './WishlistEmpty';

const WishlistContent = () => {
    const { items } = useWishlistStore();

    return (
        <section className="section py-5">
            <div className="container">
                {items.length > 0 ? (
                    <WishlistGrid items={items} />
                ) : (
                    <WishlistEmpty />
                )}
            </div>
        </section>
    );
};

export default WishlistContent;
