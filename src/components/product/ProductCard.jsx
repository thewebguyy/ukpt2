import { Link } from 'react-router-dom';
import { useWishlistStore } from '../../store/wishlistStore';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { toggleItem, isInWishlist } = useWishlistStore();
    const active = isInWishlist(product.id);

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
                        <div style={{ display: 'flex', alignItems: 'center', justifyCenter: 'center', height: '100%', color: 'var(--color-grey)' }}>No Image</div>
                    )}
                </div>
                <div className="product-info">
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '5px', fontWeight: 500 }}>
                        {(product.category || '').toUpperCase()}
                    </div>
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-price">
                        {product.price ? `£${product.price.toFixed(2)}` : 'Contact for Price'}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
