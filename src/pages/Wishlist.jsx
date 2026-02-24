import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import WishlistHero from '../components/wishlist/WishlistHero';
import WishlistContent from '../components/wishlist/WishlistContent';

const Wishlist = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="wishlist-page">
            <Helmet>
                <title>Your Wishlist | CustomiseMe UK</title>
                <meta name="description" content="Manage your wishlist of custom apparel, party decorations, and accessories from CustomiseMe UK." />
            </Helmet>

            <WishlistHero />
            <WishlistContent />
        </div>
    );
};

export default Wishlist;
