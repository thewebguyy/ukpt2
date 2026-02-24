import React from 'react';

const WishlistHero = () => {
    return (
        <section className="section py-5" style={{ backgroundColor: 'var(--color-grey-light)' }}>
            <div className="container text-center">
                <h1 className="display-4 fw-bold mb-3">YOUR WISHLIST</h1>
                <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Keep track of the custom designs and products you love.
                </p>
            </div>
        </section>
    );
};

export default WishlistHero;
