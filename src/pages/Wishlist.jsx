import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/product/ProductCard';
import { Helmet } from 'react-helmet-async';

const Wishlist = () => {
    const { items: wishlistIds, toggleItem } = useWishlistStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (wishlistIds.length === 0) {
                setProducts([]);
                return;
            }

            setLoading(true);
            try {
                // Fetch each product by ID
                const fetched = await Promise.all(
                    wishlistIds.map(id => ProductService.getProduct(id))
                );
                // Filter out any nulls (deleted products)
                setProducts(fetched.filter(p => p !== null));
            } catch (err) {
                console.error("Error fetching wishlist products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProducts();
    }, [wishlistIds]);

    const handleClearAll = () => {
        if (window.confirm('Clear all items from your wishlist?')) {
            wishlistIds.forEach(id => toggleItem(id));
        }
    };

    return (
        <div className="wishlist-page">
            <Helmet>
                <title>My Wishlist - CustomiseMe UK</title>
            </Helmet>

            <section className="section bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold">MY WISHLIST</h1>
                        <p className="text-grey-dark">Save your favorite products for later</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-5"><div className="spinner-border"></div></div>
                    ) : wishlistIds.length === 0 ? (
                        <div className="text-center py-5">
                            <svg width="80" height="80" className="text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <h3 className="h4 mb-3">Your wishlist is empty</h3>
                            <p className="text-muted mb-4">Start adding products you love!</p>
                            <Link to="/shop" className="btn btn-dark btn-lg px-5">BROWSE PRODUCTS</Link>
                        </div>
                    ) : (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <p className="text-muted mb-0">{products.length} {products.length === 1 ? 'item' : 'items'} saved</p>
                                <button className="btn btn-link text-danger text-decoration-none fw-bold" onClick={handleClearAll}>
                                    Clear All
                                </button>
                            </div>
                            <div className="product-grid">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Wishlist;
