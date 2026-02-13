import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { calculateTotalPrice } from '../../utils/pricing';

const CartOffcanvas = () => {
    const { items, removeAt, updateQuantity, clearCart } = useCartStore();

    const subtotal = items.reduce((acc, item) => {
        return acc + calculateTotalPrice(item.product, item.quantity, item.customization);
    }, 0);

    return (
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="cartOffcanvas" aria-labelledby="cartOffcanvasLabel">
            <div className="offcanvas-header border-bottom">
                <h5 className="offcanvas-title fw-bold" id="cartOffcanvasLabel">YOUR CART ({items.length})</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

            <div className="offcanvas-body">
                {items.length === 0 ? (
                    <div className="text-center py-5">
                        <svg width="64" height="64" className="text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="text-muted mb-4">Your cart is currently empty.</p>
                        <Link to="/shop" className="btn btn-dark px-4" data-bs-dismiss="offcanvas">START SHOPPING</Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-items-list">
                            {items.map((item, index) => {
                                const itemTotal = calculateTotalPrice(item.product, item.quantity, item.customization);
                                return (
                                    <div key={`${item.product.id}-${index}`} className="cart-item-row d-flex gap-3 mb-4 pb-4 border-bottom">
                                        <div className="cart-item-img border rounded overflow-hidden" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                                            <img src={item.product.imageUrl || '/placeholder.png'} className="w-100 h-100 object-fit-cover" alt={item.product.name} />
                                        </div>
                                        <div className="cart-item-info flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <h6 className="fw-bold mb-0 small text-uppercase">{item.product.name}</h6>
                                                <button className="btn btn-link p-0 text-danger" onClick={() => removeAt(index)}>
                                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                            <div className="small text-muted mb-2">
                                                {item.customization.size && <span>{item.customization.size} / </span>}
                                                {item.customization.color && <span>{item.customization.color}</span>}
                                                {item.customization.artworkName && <div className="text-success mt-1">✓ Artwork included</div>}
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="quantity-small d-flex align-items-center border px-1 rounded">
                                                    <button className="btn btn-link btn-xs p-1" onClick={() => updateQuantity(index, item.quantity - 1)}>-</button>
                                                    <span className="px-2 small fw-bold">{item.quantity}</span>
                                                    <button className="btn btn-link btn-xs p-1" onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                                                </div>
                                                <div className="fw-bold">£{itemTotal.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {items.length > 0 && (
                <div className="offcanvas-footer p-3 border-top bg-light">
                    <div className="d-flex justify-content-between mb-3 h5 fw-bold">
                        <span>SUBTOTAL</span>
                        <span>£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-grid gap-2">
                        <Link to="/checkout" className="btn btn-dark py-3 fw-bold" data-bs-dismiss="offcanvas">PROCEED TO CHECKOUT</Link>
                        <button className="btn btn-link text-muted small" onClick={clearCart}>Clear Everything</button>
                    </div>
                    <p className="text-center small text-muted mt-3 mb-0">Shipping & taxes calculated at checkout</p>
                </div>
            )}
        </div>
    );
};

export default CartOffcanvas;
