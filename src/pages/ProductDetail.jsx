import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { calculateTotalPrice } from '../utils/pricing';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const addItem = useCartStore(state => state.addItem);
    const { toggleItem, isInWishlist } = useWishlistStore();

    const [quantity, setQuantity] = useState(1);
    const [customization, setCustomization] = useState({
        color: 'White',
        size: 'M',
        printLocation: 'Front Only',
        designPosition: 'Centre',
        artwork: null,
        artworkName: ''
    });
    const [isUploading, setIsUploading] = useState(false);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => ProductService.getProduct(id),
        enabled: !!id
    });

    const { data: relatedProducts } = useQuery({
        queryKey: ['relatedProducts', product?.category],
        queryFn: () => ProductService.getProducts({ category: product?.category, limit: 4 }),
        enabled: !!product
    });

    useEffect(() => {
        if (product?.hasBulkPricing && product.bulkPricing?.length > 0) {
            setQuantity(product.bulkPricing[0].quantity);
        }
    }, [product]);

    if (isLoading) return (
        <div className="container py-5">
            <div className="row g-5">
                <div className="col-md-6">
                    <div className="skeleton skeleton-image" style={{ aspectRatio: '1/1' }}></div>
                </div>
                <div className="col-md-6">
                    <div className="skeleton skeleton-title mb-4" style={{ width: '30%' }}></div>
                    <div className="skeleton skeleton-title h1 mb-4" style={{ width: '80%' }}></div>
                    <div className="skeleton skeleton-title h3 mb-5" style={{ width: '40%' }}></div>
                    <div className="skeleton skeleton-text mb-4" style={{ height: '100px' }}></div>
                    <div className="d-flex gap-2 mb-4">
                        <div className="skeleton skeleton-text rounded-pill" style={{ height: '52px', width: '100%' }}></div>
                        <div className="skeleton skeleton-text rounded-pill" style={{ height: '52px', width: '52px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="container text-center py-5">
            <h2>Product Not Found</h2>
            <Link to="/shop" className="btn btn-primary mt-3">Back to Shop</Link>
        </div>
    );

    const totalPrice = calculateTotalPrice(product, quantity, customization);
    const isWishlisted = isInWishlist(product.id);

    const handleFileUpload = async (e) => {
        if (!user) {
            toast.error('Please log in to upload artwork.');
            e.target.value = '';
            // Or navigate to login
            return;
        }

        const file = e.target.files[0];
        if (!file) return;

        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        const ALLOWED_EXTENSIONS = ['.png', '.pdf', '.ai', '.psd'];

        if (file.size > MAX_FILE_SIZE) {
            toast.error('File too large. Maximum size is 10MB.');
            e.target.value = '';
            return;
        }

        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            toast.error('Invalid file type. Please upload PNG, PDF, AI, or PSD files.');
            e.target.value = '';
            return;
        }

        setIsUploading(true);
        try {
            const path = `uploads/${user.uid}/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);

            setCustomization(prev => ({ ...prev, artwork: url, artworkName: file.name }));
            toast.success('Artwork uploaded successfully!');
        } catch (err) {
            console.error('Artwork upload error:', err);
            // Provide more context if it's a permission error
            if (err.code === 'storage/unauthorized') {
                toast.error('Permission denied: You can only upload to your own folder.');
            } else {
                toast.error(`Upload failed: ${err.message || 'Unknown error'}`);
            }
        } finally {
            setIsUploading(false);
        }
    };
    const handleAddToCart = () => {
        // Made in demand: ignore stock
        /*
        if (product.stock <= 0) {
            toast.error('Out of stock');
            return;
        }
        */

        // Additional validation for bulk products
        if (product.hasBulkPricing && product.bulkPricing?.length > 0) {
            const isValidTier = product.bulkPricing.some(t => t.quantity === quantity);
            if (!isValidTier) {
                toast.error('Please select a valid quantity tier.');
                return;
            }
        }

        addItem(product, customization, quantity);
        toast.success('Added to cart!');
    };

    // FUNC-003: Use product-specific options instead of hardcoded globals
    const colors = product.availableColors || ['Black', 'White', 'Navy', 'Red', 'Grey', 'Green'];
    const sizes = product.availableSizes || ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

    return (
        <div className="product-page">
            <Helmet>
                <title>{product.name} - CustomiseMe UK</title>
            </Helmet>

            <div className="container py-5">
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/shop">Shop</Link></li>
                        <li className="breadcrumb-item active">{product.name}</li>
                    </ol>
                </nav>

                <div className="row g-5">
                    {/* Left Column: Visual & Detail */}
                    <div className="col-md-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="product-main-image bg-light rounded shadow-sm overflow-hidden mb-4"
                            style={{ aspectRatio: '1/1', position: 'relative' }}
                        >
                            <img
                                src={product.imageUrl || '/placeholder.png'}
                                alt={product.name}
                                className="w-100 h-100 object-fit-cover"
                            />
                        </motion.div>

                        <div className="product-description mt-5 d-none d-md-block">
                            <h5 className="fw-bold mb-3 text-uppercase letter-spacing-1">Description</h5>
                            <div className="text-grey-dark" style={{ lineHeight: '1.6' }}>
                                {product.description}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Information & Customization (Sticky) */}
                    <div className="col-md-6">
                        <div className="product-info-sticky" style={{ position: 'sticky', top: '160px' }}>
                            {/* 1. Category Badge */}
                            <span className="badge bg-light text-dark mb-2 text-uppercase px-3 py-2 letter-spacing-1" style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                                {product.category}
                            </span>

                            {/* 2. Product Title */}
                            <h1 className="display-6 fw-bold mb-4 text-uppercase letter-spacing-1">{product.name}</h1>

                            {/* 3. Customization Options */}
                            <div className="customization-groups mb-4">
                                {/* Color Swatches - Hidden for stickers */}
                                {product.category?.toLowerCase() !== 'stickers' && product.hasColors !== false && (
                                    <div className="mb-4">
                                        <label className="fw-bold small mb-2 text-uppercase d-block letter-spacing-1">Select Color</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {colors.map(c => (
                                                <button
                                                    key={c}
                                                    className={`color-swatch-btn ${customization.color === c ? 'active' : ''}`}
                                                    style={{
                                                        width: '36px', height: '36px', borderRadius: '50%',
                                                        backgroundColor: c.toLowerCase() === 'white' ? '#fff' : c.toLowerCase(),
                                                        border: customization.color === c ? '2px solid #000' : '1px solid #eee',
                                                        padding: 0, cursor: 'pointer', transition: 'all 0.2s'
                                                    }}
                                                    onClick={() => setCustomization({ ...customization, color: c })}
                                                    title={c}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Size Buttons - Hidden for stickers, label for tote bags */}
                                {product.category?.toLowerCase() !== 'stickers' && product.hasSizes !== false && (
                                    <div className="mb-4">
                                        <label className="fw-bold small mb-2 text-uppercase d-block letter-spacing-1">Select Size</label>
                                        {product.category?.toLowerCase() === 'tote bags' || product.category?.toLowerCase() === 'bags' ? (
                                            <span className="badge border text-dark fw-bold px-3 py-2">ONE SIZE</span>
                                        ) : (
                                            <div className="d-flex flex-wrap gap-2">
                                                {sizes.map(s => (
                                                    <button
                                                        key={s}
                                                        className={`btn btn-sm px-3 py-2 rounded-0 ${customization.size === s ? 'btn-dark' : 'btn-outline-dark'}`}
                                                        style={{ minWidth: '50px', fontWeight: 600 }}
                                                        onClick={() => setCustomization({ ...customization, size: s })}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Print Location - Hidden for stickers */}
                                {product.category?.toLowerCase() !== 'stickers' && (
                                    <div className="mb-4">
                                        <label className="fw-bold small mb-2 text-uppercase d-block letter-spacing-1">Print Location</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {['Front Only', 'Back Only', 'Front & Back'].map(loc => (
                                                <button
                                                    key={loc}
                                                    className={`btn btn-sm px-3 py-2 rounded-0 ${customization.printLocation === loc ? 'btn-dark' : 'btn-outline-dark'}`}
                                                    style={{ fontWeight: 600 }}
                                                    onClick={() => setCustomization({ ...customization, printLocation: loc })}
                                                >
                                                    {loc.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Design Position - Hidden for stickers */}
                                {product.category?.toLowerCase() !== 'stickers' && (
                                    <div className="mb-4">
                                        <label className="fw-bold small mb-2 text-uppercase d-block letter-spacing-1">Design Position</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {['Centre', 'Full Front'].map(pos => (
                                                <button
                                                    key={pos}
                                                    className={`btn btn-sm px-3 py-2 rounded-0 ${customization.designPosition === pos ? 'btn-dark' : 'btn-outline-dark'}`}
                                                    style={{ fontWeight: 600 }}
                                                    onClick={() => setCustomization({ ...customization, designPosition: pos })}
                                                >
                                                    {pos.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Artwork Upload Area */}
                                <div className="mb-4">
                                    <label className="fw-bold small mb-2 text-uppercase d-block letter-spacing-1">Artwork</label>
                                    <input
                                        type="file"
                                        id="artwork"
                                        className="visually-hidden"
                                        onChange={handleFileUpload}
                                        accept=".png,.pdf,.ai,.psd"
                                    />
                                    <div className={`d-grid gap-2 ${product.category?.toLowerCase() === 'stickers' ? '' : 'd-md-flex'}`}>
                                        <label
                                            htmlFor={user ? "artwork" : ""}
                                            className={`btn btn-outline-dark py-3 rounded-0 flex-grow-1 d-flex align-items-center justify-content-center`}
                                            style={{ cursor: 'pointer', fontWeight: 600 }}
                                            onClick={(e) => {
                                                if (!user) {
                                                    e.preventDefault();
                                                    toast.error('Please log in to upload artwork.');
                                                    navigate('/account', { state: { from: `/product/${id}` } });
                                                }
                                            }}
                                        >
                                            {isUploading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-upload me-2"></i>}
                                            {customization.artworkName || 'UPLOAD FILE'}
                                        </label>

                                        {/* Hidden Design Studio button for stickers */}
                                        {product.category?.toLowerCase() !== 'stickers' && (
                                            <Link
                                                to="/designservice"
                                                className="btn btn-dark py-3 rounded-0 flex-grow-1 d-flex align-items-center justify-content-center"
                                                style={{ fontWeight: 600 }}
                                            >
                                                DESIGN IN STUDIO
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 4. Price */}
                            <div className="h2 fw-bold mb-4">£{totalPrice.toFixed(2)}</div>

                            {/* 5. Quantity Selector */}
                            <div className="mb-4">
                                <label className="fw-bold small mb-2 text-uppercase d-block letter-spacing-1">Quantity</label>
                                {product.hasBulkPricing || product.category?.toLowerCase() === 'stickers' ? (
                                    <div className="row g-2">
                                        {(product.bulkPricing || [
                                            { quantity: 10, price: 0 },
                                            { quantity: 20, price: 0 },
                                            { quantity: 50, price: 0 },
                                            { quantity: 100, price: 0 }
                                        ]).map(tier => (
                                            <div key={tier.quantity} className="col-3">
                                                <button
                                                    className={`btn btn-sm w-100 rounded-0 py-2 ${quantity === tier.quantity ? 'btn-dark' : 'btn-outline-dark'}`}
                                                    style={{ fontWeight: 600 }}
                                                    onClick={() => setQuantity(tier.quantity)}
                                                >
                                                    {tier.quantity}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center">
                                        <div className="quantity-ctrl d-flex align-items-center border" style={{ height: '48px' }}>
                                            <button className="btn btn-link text-decoration-none px-3 text-dark border-0" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                            <span className="px-3 fw-bold" style={{ minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                                            <button className="btn btn-link text-decoration-none px-3 text-dark border-0" onClick={() => setQuantity(q => q + 1)}>+</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 6. Add to Cart + Wishlist row */}
                            <div className="d-flex gap-2 mb-3">
                                <button
                                    className="btn btn-dark btn-lg flex-grow-1 rounded-0 py-3 fw-bold"
                                    onClick={handleAddToCart}
                                    style={{ letterSpacing: '1px' }}
                                >
                                    ADD TO CART
                                </button>
                                <button
                                    className={`btn btn-lg border rounded-0 px-4 ${isWishlisted ? 'text-danger' : 'text-muted'}`}
                                    onClick={() => {
                                        toggleItem(product);
                                        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                                    }}
                                >
                                    <svg width="24" height="24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </button>
                            </div>

                            {/* 7. Request Custom Design */}
                            <Link
                                to={`/contact?service=custom&product=${product.id}`}
                                className="btn btn-outline-dark w-100 rounded-0 py-3 mb-4 fw-bold"
                                style={{ letterSpacing: '1px' }}
                            >
                                REQUEST CUSTOM DESIGN
                            </Link>

                            {/* 8. Meta Info Box */}
                            <div className="bg-light p-4 rounded-0 mb-5">
                                <div className="d-flex gap-3 mb-3 align-items-center">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    <div>
                                        <h6 className="mb-0 fw-bold small text-uppercase letter-spacing-1">Free UK Shipping</h6>
                                        <p className="small text-muted mb-0">On orders over £100</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-3 align-items-center">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <div>
                                        <h6 className="mb-0 fw-bold small text-uppercase letter-spacing-1">Quality Guarantee</h6>
                                        <p className="small text-muted mb-0">Premium materials & craftsmanship</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description for Mobile */}
                            <div className="product-description mt-4 d-md-none border-top pt-4">
                                <h5 className="fw-bold mb-3 text-uppercase letter-spacing-1">Description</h5>
                                <div className="text-grey-dark" style={{ lineHeight: '1.6' }}>
                                    {product.description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products: Full Width Grid */}
                <div className="mt-5 pt-5 border-top">
                    <h3 className="h4 fw-bold mb-5 text-center text-uppercase letter-spacing-2">You Might Also Like</h3>
                    <div className="product-grid-four row g-4">
                        {relatedProducts?.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                            <div key={p.id} className="col-6 col-md-3">
                                <div className="product-card-mini h-100">
                                    <Link to={`/product/${p.id}`} className="text-decoration-none text-dark">
                                        <div className="card h-100 border-0 shadow-sm hover-shadow transition overflow-hidden rounded-0">
                                            <div className="ratio ratio-1x1 bg-light">
                                                <img src={p.imageUrl || '/placeholder.png'} className="object-fit-cover" alt={p.name} />
                                            </div>
                                            <div className="card-body p-3 text-center">
                                                <h6 className="fw-bold mb-1 text-truncate text-uppercase small letter-spacing-1">{p.name}</h6>
                                                <p className="small text-muted mb-0">£{p.price?.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
