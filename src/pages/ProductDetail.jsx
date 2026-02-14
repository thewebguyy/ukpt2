import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { calculateTotalPrice } from '../utils/pricing';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    if (isLoading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;
    if (error || !product) return (
        <div className="container text-center py-5">
            <h2>Product Not Found</h2>
            <Link to="/shop" className="btn btn-primary mt-3">Back to Shop</Link>
        </div>
    );

    const totalPrice = calculateTotalPrice(product, quantity, customization);
    const isWishlisted = isInWishlist(product.id);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        const ALLOWED_TYPES = ['image/png', 'application/pdf', 'application/postscript', 'image/vnd.adobe.photoshop'];
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
            const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);

            setCustomization(prev => ({ ...prev, artwork: url, artworkName: file.name }));
            toast.success('Artwork uploaded successfully!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload artwork.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddToCart = () => {
        if (product.stock <= 0) {
            toast.error('Out of stock');
            return;
        }

        addItem(product, customization, quantity);
        toast.success('Added to cart!');
        // Proactively open cart? Or just show toast. 
        // The user rules says "be proactive but don't surprise". 
        // I'll stick to toast for now as it's common in React apps unless they have an offcanvas ready.
    };

    const colors = ['Black', 'White', 'Navy', 'Red', 'Grey', 'Green'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

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
                    {/* Images */}
                    <div className="col-md-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="product-main-image bg-light rounded shadow-sm overflow-hidden"
                            style={{ aspectRatio: '1/1', position: 'relative' }}
                        >
                            <img
                                src={product.imageUrl || '/placeholder.png'}
                                alt={product.name}
                                className="w-100 h-100 object-fit-cover"
                            />
                        </motion.div>
                        <div className="mt-4 text-grey-dark">
                            <h5 className="fw-bold mb-3">DESCRIPTION</h5>
                            <p>{product.description}</p>
                        </div>
                    </div>

                    {/* Details & Customization */}
                    <div className="col-md-6">
                        <div className="product-info-panel">
                            <span className="badge bg-light text-dark mb-2 text-uppercase">{product.category}</span>
                            <h1 className="h2 fw-bold mb-3">{product.name}</h1>
                            <div className="h3 fw-bold mb-4">£{totalPrice.toFixed(2)}</div>

                            {/* Customization Groups */}
                            {!product.hasBulkPricing && (
                                <>
                                    <div className="mb-4">
                                        <label className="fw-bold small mb-2 text-uppercase">Select Color</label>
                                        <div className="d-flex gap-2">
                                            {colors.map(c => (
                                                <button
                                                    key={c}
                                                    className={`color-swatch-btn ${customization.color === c ? 'active' : ''}`}
                                                    style={{
                                                        width: '32px', height: '32px', borderRadius: '50%',
                                                        backgroundColor: c.toLowerCase(), border: customization.color === c ? '2px solid #000' : '1px solid #ddd'
                                                    }}
                                                    onClick={() => setCustomization({ ...customization, color: c })}
                                                    title={c}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="fw-bold small mb-2 text-uppercase">Select Size</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {sizes.map(s => (
                                                <button
                                                    key={s}
                                                    className={`btn btn-sm ${customization.size === s ? 'btn-dark' : 'btn-outline-dark'}`}
                                                    onClick={() => setCustomization({ ...customization, size: s })}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Bulk Pricing Quantities */}
                            {product.hasBulkPricing && (
                                <div className="mb-4">
                                    <label className="fw-bold small mb-2 text-uppercase">Select Quantity</label>
                                    <div className="row g-2">
                                        {product.bulkPricing.map(tier => (
                                            <div key={tier.quantity} className="col-3">
                                                <button
                                                    className={`btn btn-sm w-100 ${quantity === tier.quantity ? 'btn-dark' : 'btn-outline-dark'}`}
                                                    onClick={() => setQuantity(tier.quantity)}
                                                >
                                                    {tier.quantity}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Artwork Upload */}
                            <div className="mb-4">
                                <label className="fw-bold small mb-2 text-uppercase d-block">Upload Artwork</label>
                                <div className="d-grid gap-2">
                                    <input
                                        type="file"
                                        id="artwork"
                                        className="d-none"
                                        onChange={handleFileUpload}
                                        accept=".png,.pdf,.ai,.psd"
                                    />
                                    <label htmlFor="artwork" className="btn btn-outline-dark py-3 cursor-pointer">
                                        {isUploading ? (
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                        ) : (
                                            <svg width="20" height="20" className="me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                        )}
                                        {customization.artworkName || 'Upload Your File'}
                                    </label>
                                    <p className="small text-muted mt-1">PNG, PDF, AI, PSD (Min 300 DPI recommended)</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-2 mb-4">
                                <div className="quantity-ctrl d-flex align-items-center border px-2 rounded" style={{ display: product.hasBulkPricing ? 'none' : 'flex' }}>
                                    <button className="btn btn-link text-decoration-none px-2" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                    <span className="px-3 fw-bold">{quantity}</span>
                                    <button className="btn btn-link text-decoration-none px-2" onClick={() => setQuantity(q => q + 1)}>+</button>
                                </div>
                                <button
                                    className={`btn btn-lg flex-grow-1 ${product.stock > 0 ? 'btn-dark' : 'btn-secondary disabled'}`}
                                    onClick={handleAddToCart}
                                >
                                    {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                                </button>
                                <button
                                    className={`btn btn-lg border ${isWishlisted ? 'text-danger' : 'text-muted'}`}
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

                            {/* Meta Info */}
                            <div className="bg-light p-4 rounded mt-5">
                                <div className="d-flex gap-3 mb-3">
                                    <svg className="text-muted" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    <div>
                                        <h6 className="mb-0 fw-bold">FREE UK SHIPPING</h6>
                                        <p className="small text-muted mb-0">On orders over £100</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-3">
                                    <svg className="text-muted" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <div>
                                        <h6 className="mb-0 fw-bold">QUALITY GUARANTEE</h6>
                                        <p className="small text-muted mb-0">Premium materials & craftsmanship</p>
                                    </div>
                                </div>
                            </div>

                            {/* Design CTAs */}
                            <div className="d-grid gap-2 mt-4">
                                <Link to="/designservice" className="btn btn-outline-dark btn-lg fw-bold">DESIGN IN STUDIO</Link>
                                <Link to="/contact?service=custom" className="btn btn-outline-secondary fw-bold">REQUEST CUSTOM DESIGN</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-5 pt-5 border-top">
                    <h3 className="h4 fw-bold mb-4">YOU MIGHT ALSO LIKE</h3>
                    <div className="row g-4">
                        {relatedProducts?.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                            <div key={p.id} className="col-6 col-md-3">
                                <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                                    <Link to={`/product/${p.id}`} className="text-decoration-none text-dark">
                                        <img src={p.imageUrl || '/placeholder.png'} className="card-img-top object-fit-cover" style={{ height: '200px' }} alt={p.name} />
                                        <div className="card-body p-3">
                                            <h6 className="fw-bold mb-1 text-truncate">{p.name}</h6>
                                            <p className="small text-muted mb-0">£{p.price?.toFixed(2)}</p>
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
