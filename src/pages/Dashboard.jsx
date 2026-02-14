import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '' });
    const [isSaving, setIsSaving] = useState(false);

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
                // Trigger a refresh or manual update of auth state if possible
                // authStore listener will handle it if it picks up changes from Firestore
            } else {
                toast.error(result.message || 'Failed to update profile');
            }
        } catch (err) {
            toast.error('Error updating profile');
        } finally {
            setIsSaving(false);
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
                        <h2 className="fw-bold h4 mb-4">ORDER HISTORY</h2>

                        {isLoading ? (
                            <div className="text-center py-5"><div className="spinner-border"></div></div>
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
                            <div className="card border-0 shadow-sm p-5 text-center rounded-4">
                                <p className="text-muted mb-0">You haven't placed any orders yet.</p>
                                <Link to="/shop" className="btn btn-link fw-bold text-dark text-decoration-none mt-2">Start Shopping &rarr;</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
