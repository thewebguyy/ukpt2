import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const OrderTracking = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setOrderData(null);

        try {
            const orderRef = doc(db, 'orders', orderId.trim());
            const orderSnap = await getDoc(orderRef);

            if (!orderSnap.exists()) {
                toast.error('Order not found. Please check your order number.');
                return;
            }

            const data = orderSnap.data();

            // Verify email matches order for security
            if (data.email?.toLowerCase() !== email.trim().toLowerCase()) {
                toast.error('Email does not match this order. Please check your details.');
                return;
            }

            toast.success('Order found!');
            setOrderData({
                id: orderId.trim(),
                status: data.status || 'pending',
                trackingNumber: data.trackingNumber || null,
                estimatedDelivery: data.estimatedDelivery || null
            });
        } catch (error) {
            console.error('Order tracking error:', error);
            toast.error('Failed to look up order. Please try again.');
            setOrderData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="order-tracking-page">
            <Helmet>
                <title>Track Your Order - CustomiseMe UK</title>
            </Helmet>

            <section className="section bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold">TRACK YOUR ORDER</h1>
                        <p className="text-grey-dark">Enter your order details to see the latest status</p>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm p-4 mb-4">
                                <form onSubmit={handleTrack}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">ORDER NUMBER</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            placeholder="e.g., CMUK_001"
                                            required
                                            value={orderId}
                                            onChange={(e) => setOrderId(e.target.value)}
                                        />
                                        <small className="text-muted">Found in your confirmation email</small>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold small">EMAIL ADDRESS</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            placeholder="your@email.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-dark btn-lg w-100" disabled={loading}>
                                        {loading ? 'TRACKING...' : 'TRACK ORDER'}
                                    </button>
                                </form>
                            </div>

                            {orderData && (
                                <div className="card border-0 shadow-sm p-4">
                                    <h3 className="h5 fw-bold mb-4">ORDER STATUS</h3>
                                    <div className="mb-3">
                                        <strong>Order ID:</strong> {orderData.id}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Status:</strong>
                                        <span className="badge bg-success ms-2">{orderData.status.toUpperCase()}</span>
                                    </div>
                                    {orderData.trackingNumber && (
                                        <div className="mb-3">
                                            <strong>Tracking Number:</strong> {orderData.trackingNumber}
                                        </div>
                                    )}
                                    {orderData.estimatedDelivery && (
                                        <div className="mb-4">
                                            <strong>Estimated Delivery:</strong> {orderData.estimatedDelivery}
                                        </div>
                                    )}
                                    {orderData.trackingNumber ? (
                                        <a
                                            href={`https://www.royalmail.com/track-your-item#/${orderData.trackingNumber}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-dark w-100"
                                        >
                                            TRACK WITH ROYAL MAIL
                                        </a>
                                    ) : (
                                        <p className="text-muted small mb-0">Tracking information will be available once your order ships.</p>
                                    )}

                                    <div className="d-flex gap-2 mt-4">
                                        <Link to="/shop" className="btn btn-outline-dark flex-grow-1">Continue Shopping</Link>
                                        <Link to="/checkout" className="btn btn-dark flex-grow-1">Buy Again</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OrderTracking;
