import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { calculateTotalPrice } from '../utils/pricing';
import { CheckoutService } from '../services/checkout.service';
import { PostcodeService } from '../services/postcode.service';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';

const Checkout = () => {
    const { items, updateQuantity, removeAt, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Basket, 2: Shipping
    const [shippingData, setShippingData] = useState({
        email: user?.email || '',
        name: user?.name || '',
        address: '',
        city: '',
        postcode: ''
    });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLookingUp, setIsLookingUp] = useState(false);

    const subtotal = items.reduce((acc, item) => {
        return acc + calculateTotalPrice(item.product, item.quantity, item.customization);
    }, 0);

    // UX-002: UK VAT is inclusive. Extract instead of adding.
    const tax = subtotal - (subtotal / 1.2);
    const shippingThreshold = 100;
    const shippingCost = subtotal >= shippingThreshold ? 0 : 4.99;
    const total = subtotal + shippingCost;

    const freeShippingProgress = Math.min((subtotal / shippingThreshold) * 100, 100);

    const handleCheckout = async () => {
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const newErrors = {};

        if (!shippingData.email) newErrors.email = 'Email is required';
        else if (!EMAIL_REGEX.test(shippingData.email.trim())) newErrors.email = 'Invalid email address';

        if (!shippingData.name) newErrors.name = 'Full name is required';
        if (!shippingData.address) newErrors.address = 'Address is required';
        if (!shippingData.city) newErrors.city = 'City is required';

        if (!shippingData.postcode) newErrors.postcode = 'Postcode is required';
        else if (!PostcodeService.validate(shippingData.postcode)) newErrors.postcode = 'Invalid UK postcode format (e.g. SW1A 1AA)';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please correct the errors in the form');
            return;
        }

        // TECH-003: Final stock validation before checkout
        for (const item of items) {
            if (item.product.stock !== undefined && item.quantity > item.product.stock) {
                toast.error(`${item.product.name} only has ${item.product.stock} units available.`);
                return;
            }
        }

        setIsProcessing(true);
        try {
            const { url } = await CheckoutService.createCheckoutSession({
                items: items.map(item => ({
                    productId: item.product.id,
                    name: item.product.name,
                    price: calculateTotalPrice(item.product, item.quantity, item.customization) / item.quantity,
                    quantity: item.quantity,
                    customization: item.customization,
                    imageUrl: item.product.imageUrl || item.product.images?.[0]
                })),
                email: shippingData.email,
                shippingAddress: shippingData,
                successUrl: window.location.origin + '/order-confirmation',
                cancelUrl: window.location.origin + '/checkout'
            });

            if (url) {
                window.location.href = url; // Redirect to Stripe
            } else {
                throw new Error("No URL returned from checkout service");
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to initiate checkout. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container py-5 text-center">
                <h2 className="fw-bold mb-4">Your basket is empty</h2>
                <Link to="/shop" className="btn btn-dark btn-lg px-5 rounded-pill">CONTINUE SHOPPING</Link>
            </div>
        );
    }

    return (
        <div className="checkout-page py-5 bg-light min-vh-100">
            <Helmet>
                <title>Checkout - CustomiseMe UK</title>
            </Helmet>

            <div className="container">
                <div className="row g-4">
                    {/* Left: Basket or Shipping Form */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h1 className="h3 fw-bold mb-0">YOUR BASKET</h1>
                                <span className="text-muted">{items.length} items</span>
                            </div>

                            {step === 1 ? (
                                <div className="basket-content">
                                    <div className="d-none d-md-grid grid-header mb-3 text-muted small fw-bold text-uppercase" style={{ gridTemplateColumns: '3fr 1fr 1fr' }}>
                                        <span>Product</span>
                                        <span className="text-center">Quantity</span>
                                        <span className="text-end">Total</span>
                                    </div>

                                    {items.map((item, index) => {
                                        const itemTotal = calculateTotalPrice(item.product, item.quantity, item.customization);
                                        return (
                                            <div key={index} className="d-flex flex-column d-md-grid align-items-center py-3 border-top" style={{ gridTemplateColumns: '3fr 1fr 1fr' }}>
                                                <div className="d-flex gap-3 align-items-center mb-3 mb-md-0">
                                                    <img src={item.product.imageUrl || '/placeholder.png'} alt={item.product.name} className="rounded border" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                                                    <div>
                                                        <h6 className="fw-bold mb-1 small text-uppercase">{item.product.name}</h6>
                                                        <div className="small text-muted">
                                                            {item.customization.size} / {item.customization.color}
                                                        </div>
                                                        <button className="btn btn-link btn-sm p-0 text-danger text-decoration-none mt-1" onClick={() => removeAt(index)}>Remove</button>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center gap-2 mb-3 mb-md-0">
                                                    <div className="quantity-controls d-flex border rounded overflow-hidden">
                                                        <button className="btn btn-light btn-sm px-2 border-0" onClick={() => updateQuantity(index, item.quantity - 1)}>-</button>
                                                        <input type="text" className="form-control form-control-sm text-center border-0 p-0" style={{ width: '35px' }} value={item.quantity} readOnly />
                                                        <button
                                                            className="btn btn-light btn-sm px-2 border-0"
                                                            onClick={() => {
                                                                try {
                                                                    updateQuantity(index, item.quantity + 1);
                                                                } catch (e) {
                                                                    toast.error(e.message);
                                                                }
                                                            }}
                                                        >+</button>
                                                    </div>
                                                </div>
                                                <div className="text-end fw-bold h6 mb-0">
                                                    £{itemTotal.toFixed(2)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="shipping-content">
                                    <div className="d-flex align-items-center mb-4">
                                        <button className="btn btn-link p-0 text-dark text-decoration-none me-3" onClick={() => setStep(1)}>&larr; Back to Basket</button>
                                        <h2 className="h5 fw-bold mb-0">SHIPPING DETAILS</h2>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">EMAIL ADDRESS *</label>
                                            <input
                                                type="email"
                                                autoComplete="email"
                                                className={`form-control form-control-lg bg-light border-0 ${errors.email ? 'is-invalid' : ''}`}
                                                value={shippingData.email}
                                                onChange={(e) => {
                                                    setShippingData({ ...shippingData, email: e.target.value });
                                                    if (errors.email) setErrors({ ...errors, email: '' });
                                                }}
                                                placeholder="e.g. alex@example.com"
                                                required
                                            />
                                            {errors.email && <div className="invalid-feedback small">{errors.email}</div>}
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">FULL NAME *</label>
                                            <input
                                                type="text"
                                                autoComplete="name"
                                                className={`form-control form-control-lg bg-light border-0 ${errors.name ? 'is-invalid' : ''}`}
                                                value={shippingData.name}
                                                onChange={(e) => {
                                                    setShippingData({ ...shippingData, name: e.target.value });
                                                    if (errors.name) setErrors({ ...errors, name: '' });
                                                }}
                                                placeholder="e.g. Alex Smith"
                                                required
                                            />
                                            {errors.name && <div className="invalid-feedback small">{errors.name}</div>}
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">ADDRESS *</label>
                                            <input
                                                type="text"
                                                autoComplete="address-line1"
                                                className={`form-control form-control-lg bg-light border-0 ${errors.address ? 'is-invalid' : ''}`}
                                                value={shippingData.address}
                                                onChange={(e) => {
                                                    setShippingData({ ...shippingData, address: e.target.value });
                                                    if (errors.address) setErrors({ ...errors, address: '' });
                                                }}
                                                placeholder="e.g. 123 High Street"
                                                required
                                            />
                                            {errors.address && <div className="invalid-feedback small">{errors.address}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">CITY *</label>
                                            <input
                                                type="text"
                                                autoComplete="address-level2"
                                                className={`form-control form-control-lg bg-light border-0 ${errors.city ? 'is-invalid' : ''}`}
                                                value={shippingData.city}
                                                onChange={(e) => {
                                                    setShippingData({ ...shippingData, city: e.target.value });
                                                    if (errors.city) setErrors({ ...errors, city: '' });
                                                }}
                                                placeholder="e.g. London"
                                                required
                                            />
                                            {errors.city && <div className="invalid-feedback small">{errors.city}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">POSTCODE *</label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    autoComplete="postal-code"
                                                    className={`form-control form-control-lg bg-light border-0 ${errors.postcode ? 'is-invalid' : ''}`}
                                                    value={shippingData.postcode}
                                                    onChange={(e) => {
                                                        const val = e.target.value.toUpperCase();
                                                        setShippingData({ ...shippingData, postcode: val });
                                                        if (errors.postcode) setErrors({ ...errors, postcode: '' });
                                                    }}
                                                    onBlur={() => {
                                                        if (shippingData.postcode && !PostcodeService.validate(shippingData.postcode)) {
                                                            setErrors({ ...errors, postcode: 'Invalid UK postcode format' });
                                                        }
                                                    }}
                                                    placeholder="e.g. SW1A 1AA"
                                                    required
                                                />
                                                <button
                                                    className="btn btn-dark btn-sm"
                                                    type="button"
                                                    onClick={async () => {
                                                        if (!shippingData.postcode) return;
                                                        if (!PostcodeService.validate(shippingData.postcode)) {
                                                            setErrors({ ...errors, postcode: 'Invalid UK postcode format' });
                                                            return;
                                                        }
                                                        setIsLookingUp(true);
                                                        const res = await PostcodeService.lookup(shippingData.postcode);
                                                        if (res.success) {
                                                            setShippingData({ ...shippingData, city: res.result.city });
                                                            toast.success('Address details updated');
                                                        } else {
                                                            toast.error(res.message);
                                                        }
                                                        setIsLookingUp(false);
                                                    }}
                                                    disabled={isLookingUp || !shippingData.postcode}
                                                >
                                                    {isLookingUp ? <span className="spinner-border spinner-border-sm"></span> : 'FIND'}
                                                </button>
                                            </div>
                                            {errors.postcode && <div className="invalid-feedback d-block small">{errors.postcode}</div>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!user && step === 1 && (
                            <div className="alert alert-info border-0 rounded-4 p-3 d-flex align-items-center gap-3">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Already have an account? <Link to="/account" className="fw-bold text-dark">Log in</Link> for faster checkout.</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Summary */}
                    <div className="col-lg-4">
                        {/* Free Shipping Progress */}
                        <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="small fw-bold">FREE SHIPPING PROGRESS</span>
                                <span className="small fw-bold">{freeShippingProgress >= 100 ? 'UNLOCKED!' : `£${(shippingThreshold - subtotal).toFixed(2)} AWAY`}</span>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                                <div
                                    className={`progress-bar ${freeShippingProgress >= 100 ? 'bg-success' : 'bg-danger'}`}
                                    style={{ width: `${freeShippingProgress}%` }}
                                ></div>
                            </div>
                            <p className="small text-muted mt-2 mb-0">Free shipping on all UK orders over £{shippingThreshold}.</p>
                        </div>

                        <div className="card border-0 shadow-sm p-4 rounded-4 sticky-top" style={{ top: '100px' }}>
                            <h2 className="h5 fw-bold mb-4">ORDER SUMMARY</h2>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span>£{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Includes VAT (20%)</span>
                                <span>£{tax.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Shipping</span>
                                <span className={shippingCost === 0 ? 'text-success fw-bold' : ''}>{shippingCost === 0 ? 'FREE' : `£${shippingCost.toFixed(2)}`}</span>
                            </div>
                            <div className="divider my-3 h-px bg-light"></div>
                            <div className="d-flex justify-content-between h4 fw-bold mb-4">
                                <span>TOTAL</span>
                                <span className="text-danger">£{total.toFixed(2)}</span>
                            </div>

                            {step === 1 ? (
                                <button className="btn btn-dark btn-lg w-100 py-3 rounded-pill fw-bold" onClick={() => setStep(2)}>
                                    ENTER SHIPPING DETAILS
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary btn-lg w-100 py-3 rounded-pill fw-bold border-0"
                                    style={{ backgroundColor: '#635bff' }}
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                                    PROCEED TO PAYMENT
                                </button>
                            )}

                            <div className="text-center mt-3">
                                <img src="https://help.zazzle.com/hc/article_attachments/360010513393/Payment-Icons-2018.png" style={{ height: '24px', opacity: 0.6 }} alt="Payment Methods" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
