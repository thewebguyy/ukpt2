import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useCartStore } from '../store/cartStore';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const OrderConfirmation = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [status, setStatus] = useState('loading'); // loading, success, error
    const clearCart = useCartStore(state => state.clearCart);

    useEffect(() => {
        if (!orderId) {
            setStatus('error');
            return;
        }

        // Clear cart on entry
        clearCart();

        // Listen for order status updates (wait for 'paid' via webhook)
        const orderRef = doc(db, 'orders', orderId);
        const unsubscribe = onSnapshot(orderRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.status === 'paid') {
                    setStatus('success');
                }
            } else {
                setStatus('error');
            }
        }, (err) => {
            console.error(err);
            setStatus('error');
        });

        // Fallback: Timeout after 10 seconds and show success if the doc exists
        const timer = setTimeout(async () => {
            const snap = await getDoc(orderRef);
            if (snap.exists()) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        }, 10000);

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, [orderId, clearCart]);

    return (
        <div className="order-confirmation-page py-5 bg-light min-vh-100 d-flex align-items-center">
            <Helmet>
                <title>Order Confirmed - CustomiseMe UK</title>
            </Helmet>

            <div className="container">
                <div className="card border-0 shadow-lg p-5 mx-auto rounded-4 text-center" style={{ maxWidth: '600px' }}>
                    {status === 'loading' && (
                        <div className="py-4">
                            <div className="spinner-border mb-4" style={{ width: '3rem', height: '3rem' }}></div>
                            <h1 className="h3 fw-bold mb-2 text-uppercase">CONFIRMING PAYMENT...</h1>
                            <p className="text-muted">We're verifying your transaction with Stripe.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                        >
                            <div className="success-icon bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                                <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h1 className="h2 fw-bold mb-3">ORDER CONFIRMED!</h1>
                            <p className="text-muted mb-4 px-md-5">Thank you for your purchase. We've received your order and are getting it ready for you.</p>

                            <div className="bg-light p-3 rounded mb-4">
                                <div className="small text-muted text-uppercase fw-bold mb-1">Order Number</div>
                                <div className="h4 fw-bold mb-0 text-dark" style={{ letterSpacing: '2px' }}>{orderId}</div>
                            </div>

                            <div className="d-grid gap-2 mb-4">
                                <Link to="/dashboard" className="btn btn-dark btn-lg py-3 rounded-pill fw-bold shadow-sm">VIEW ORDER STATUS</Link>
                                <Link to="/shop" className="btn btn-outline-dark btn-md py-2 rounded-pill fw-bold border-2">Continue Shopping</Link>
                            </div>

                            <p className="small text-muted mb-0">A confirmation email has been sent to your inbox.</p>
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <div className="py-4">
                            <div className="text-danger mb-4">
                                <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h1 className="h3 fw-bold mb-3">SOMETHING WENT WRONG</h1>
                            <p className="text-muted px-md-5">We couldn't verify your order status. If you received a confirmation from Stripe, don't worry—your order is safe.</p>
                            <Link to="/contact" className="btn btn-dark btn-lg py-3 rounded-pill fw-bold px-5 mt-3">CONTACT SUPPORT</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
