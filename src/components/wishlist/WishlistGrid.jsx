import React from 'react';
import ProductCard from '../product/ProductCard';

const WishlistGrid = ({ items }) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem',
                padding: '2rem 0'
            }}
        >
            {items.map(item => (
                <ProductCard key={item.id} product={item} />
            ))}
        </div>
    );
};

export default WishlistGrid;
