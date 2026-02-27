import { Link, useNavigate } from 'react-router-dom';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { toggleItem, isInWishlist } = useWishlistStore();
    const addItem = useCartStore((state) => state.addItem);
    const active = isInWishlist(product.id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // If the product has a design service or is explicitly customizable, 
        // we should probably send them to the detail page instead of simple add.
        if (product.isCustomizable || product.requireArtwork) {
            navigate(`/product/${product.id}`);
            return;
        }

        addItem(product);
        toast.success(`Added ${product.name} to basket!`);
    };

    return (
        <div className="product-card">
            <div className="wishlist-badge">
                <button
                    className={`wishlist-btn ${active ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleItem(product);
                        toast.success(active ? 'Removed from wishlist' : 'Added to wishlist');
                    }}
                >
                    <svg className="icon"><use xlinkHref="#icon-heart" /></svg>
                </button>
            </div>
            <Link to={`/product/${product.id}`} className="product-card-link">
                <div className="product-image">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} loading="lazy" />
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-grey)' }}>No Image</div>
                    )}
                </div>
                <div className="product-info">
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '5px', fontWeight: 500 }}>
                        {(product.category || '').toUpperCase()}
                    </div>
                    <h3 className="product-title">{product.name}</h3>
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                        <div className="product-price">
                            {product.price ? `£${product.price.toFixed(2)}` : 'Contact for Price'}
                        </div>
                        <button
                            className="btn btn-dark btn-sm rounded-0 rounded-circle p-2 d-flex align-items-center justify-content-center"
                            onClick={handleAddToCart}
                            style={{ width: '36px', height: '36px' }}
                            title="Add to Basket"
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
