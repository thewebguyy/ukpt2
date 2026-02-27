import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [lookupId, setLookupId] = useState('');
    const [lookupLoading, setLookupLoading] = useState(false);
    const [foundOrder, setFoundOrder] = useState(null);

    useEffect(() => {
        if (user) {
            setEditData({ name: user.name, email: user.email });
        }
    }, [user]);

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders', user?.email],
        queryFn: () => OrderService.getUserOrders(user?.email),
        enabled: !!user
    });

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const result = await AuthService.updateUserProfile(user.uid, { name: editData.name });
            if (result.success) {
                toast.success('Profile updated successfully!');
                setIsEditing(false);
                // FUNC-001: Manually update authStore so UI reflects name change immediately
                useAuthStore.getState().setUser({ ...user, name: editData.name });
            } else {
                toast.error(result.message || 'Failed to update profile');
            }
        } catch (err) {
            toast.error('Error updating profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLookupOrder = async (e) => {
        e.preventDefault();
        setLookupLoading(true);
        setFoundOrder(null);
        try {
            const trackOrderFn = httpsCallable(functions, 'trackOrder');
            const result = await trackOrderFn({
                orderId: lookupId.trim(),
                email: user?.email.trim().toLowerCase()
            });

            if (result.data.success) {
                setFoundOrder(result.data.order);
                toast.success('Order found!');
            } else {
                toast.error(result.data.message || 'Order not found.');
            }
        } catch (err) {
            toast.error('Error looking up order');
        } finally {
            setLookupLoading(false);
        }
    };

    return (
        <div className="dashboard-page py-5 bg-light min-vh-100">
            <Helmet>
                <title>My Dashboard - CustomiseMe UK</title>
            </Helmet>

            <div className="container">
                <div className="row g-4">
                    {/* Sidebar / Profile Info */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm p-4 rounded-4 text-center">
                            {isEditing ? (
                                <form onSubmit={handleSaveProfile} className="text-start">
                                    <h5 className="fw-bold mb-3 text-center">EDIT PROFILE</h5>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">FULL NAME</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">EMAIL (READ-ONLY)</label>
                                        <input
                                            type="email"
                                            className="form-control bg-light border-0"
                                            value={editData.email}
                                            disabled
                                        />
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-dark btn-sm rounded-pill" disabled={isSaving}>
                                            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                                        </button>
                                        <button type="button" className="btn btn-link btn-sm text-muted text-decoration-none" onClick={() => setIsEditing(false)}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                                        <span className="h2 mb-0 fw-bold">{user?.name?.charAt(0) || 'U'}</span>
                                    </div>
                                    <h4 className="fw-bold mb-1">{user?.name}</h4>
                                    <p className="text-muted small mb-3">{user?.email}</p>

                                    <div className="d-grid gap-2">
                                        <button className="btn btn-outline-dark btn-sm rounded-pill" onClick={() => setIsEditing(true)}>Edit Profile</button>
                                        <button className="btn btn-dark btn-sm rounded-pill" onClick={logout}>Log Out</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="col-lg-8">
                        <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
                            <h2 className="fw-bold h4 mb-0">ORDER HISTORY</h2>
                            <div className="small text-muted border-start ps-3 py-1 d-none d-md-block">
                                <i className="bi bi-info-circle me-1"></i>
                                Just ordered? It may take a moment to appear.
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="card border-0 shadow-sm p-4 rounded-4">
                                <div className="skeleton skeleton-title mb-4" style={{ width: '30%' }}></div>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="mb-3">
                                        <div className="skeleton skeleton-text" style={{ height: '40px' }}></div>
                                    </div>
                                ))}
                            </div>
                        ) : orders && orders.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover bg-white rounded-4 overflow-hidden shadow-sm">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="border-0 px-4">ORDER #</th>
                                            <th className="border-0">DATE</th>
                                            <th className="border-0">STATUS</th>
                                            <th className="border-0 text-end px-4">TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td className="px-4 fw-bold">{order.id}</td>
                                                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                <td>
                                                    <span className={`badge rounded-pill px-3 ${order.status === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                        {(order.status || 'pending').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="text-end px-4 fw-bold">£{order.total?.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="card border-0 shadow-sm p-5 text-center rounded-4 mb-4">
                                <div className="mb-3">
                                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-muted opacity-50"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                </div>
                                <h3 className="h5 fw-bold mb-2">NO ORDERS FOUND</h3>
                                <p className="text-muted mb-4">If you've just placed an order, it might take a few minutes to show up in your history.</p>
                                <div className="d-flex justify-content-center gap-2">
                                    <Link to="/shop" className="btn btn-dark rounded-pill px-4">START SHOPPING</Link>
                                    <Link to="/order-tracking" className="btn btn-outline-dark rounded-pill px-4">TRACK AS GUEST</Link>
                                </div>
                            </div>
                        )}

                        {/* Order Lookup Tool */}
                        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mt-4">
                            <h5 className="fw-bold mb-3">QUICK ORDER LOOKUP</h5>
                            <p className="text-muted small mb-4">Can't find an order? Enter the order ID below to check its status. We'll check using your account email: <strong>{user?.email}</strong></p>

                            <form onSubmit={handleLookupOrder} className="row g-2 mb-3">
                                <div className="col-sm-8 col-md-9">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg bg-light border-0"
                                        placeholder="e.g. CMUK_001"
                                        required
                                        value={lookupId}
                                        onChange={(e) => setLookupId(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-4 col-md-3">
                                    <button type="submit" className="btn btn-dark btn-lg w-100 py-3 rounded-pill fw-bold border-0" style={{ backgroundColor: '#635bff' }} disabled={lookupLoading}>
                                        {lookupLoading ? <span className="spinner-border spinner-border-sm"></span> : 'LOOKUP'}
                                    </button>
                                </div>
                            </form>

                            {foundOrder && (
                                <div className="alert alert-success border-0 rounded-4 p-4 mt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="fw-bold mb-0">ORDER FOUND: {foundOrder.id}</h6>
                                        <span className={`badge rounded-pill px-3 py-2 ${foundOrder.status === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                            {foundOrder.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="row g-3 small">
                                        <div className="col-6 col-md-3">
                                            <div className="text-muted">Placed on</div>
                                            <div className="fw-bold">{foundOrder.createdAt ? new Date(foundOrder.createdAt).toLocaleDateString() : 'N/A'}</div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <div className="text-muted">Total</div>
                                            <div className="fw-bold">£{foundOrder.total?.toFixed(2)}</div>
                                        </div>
                                        <div className="col-12 col-md-6 text-md-end">
                                            <Link to="/order-tracking" className="btn btn-link btn-sm text-dark p-0 fw-bold text-decoration-none">View full tracking details &rarr;</Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="text-center pt-3 border-top mt-3">
                                <p className="small text-muted mb-0">
                                    Used a different email? <Link to="/order-tracking" className="text-dark fw-bold">Use our guest tracking tool &rarr;</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
