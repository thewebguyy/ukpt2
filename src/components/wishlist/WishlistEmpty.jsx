import React from 'react';
import { Link } from 'react-router-dom';

const WishlistEmpty = () => {
    return (
        <div className="text-center py-5">
            <div className="mb-4 opacity-25">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </div>
            <h3 className="fw-bold mb-3">YOUR WISHLIST IS EMPTY</h3>
            <p className="text-muted mb-5 mx-auto" style={{ maxWidth: '400px' }}>
                You haven't added any items to your wishlist yet.
                Explore our collection to find something special.
            </p>
            <Link to="/shop" className="btn btn-primary px-5 btn-lg">
                GO TO SHOP
            </Link>
        </div>
    );
};

export default WishlistEmpty;
