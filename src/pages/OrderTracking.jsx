import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';

const OrderTracking = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // TODO: Implement actual order tracking via Firebase
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Order found!');
            setOrderData({
                id: orderId,
                status: 'shipped',
                trackingNumber: 'UK123456789GB',
                estimatedDelivery: 'Feb 17, 2026'
            });
        } catch (error) {
            toast.error('Order not found. Please check your details.');
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
                                    <div className="mb-3">
                                        <strong>Tracking Number:</strong> {orderData.trackingNumber}
                                    </div>
                                    <div className="mb-4">
                                        <strong>Estimated Delivery:</strong> {orderData.estimatedDelivery}
                                    </div>
                                    <a
                                        href={`https://www.royalmail.com/track-your-item#/${orderData.trackingNumber}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-dark w-100"
                                    >
                                        TRACK WITH ROYAL MAIL
                                    </a>
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
