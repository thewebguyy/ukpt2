import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Navigate } from 'react-router-dom';
import AdminOrders from './tabs/AdminOrders';
import AdminProducts from './tabs/AdminProducts';
import AdminUpload from './tabs/AdminUpload';
import AdminReviews from './tabs/AdminReviews';
import AdminCustomOrders from './tabs/AdminCustomOrders';
import { Helmet } from 'react-helmet-async';
import { ADMIN_EMAILS } from '../../config/admin';

const AdminDashboard = () => {
    const { user, loading } = useAuthStore();
    const [activeTab, setActiveTab] = useState('products');

    if (loading) return <div className="p-5 text-center"><div className="spinner-border"></div></div>;

    if (!user || !ADMIN_EMAILS.includes(user.email)) {
        return <Navigate to="/account" />;
    }

    const tabs = [
        { id: 'products', label: 'Products' },
        { id: 'upload', label: 'Upload' },
        { id: 'orders', label: 'Orders' },
        { id: 'custom-orders', label: 'Custom Requests' },
        { id: 'reviews', label: 'Reviews' },
    ];

    return (
        <div className="admin-dashboard py-5 bg-light min-vh-100">
            <Helmet>
                <title>Admin Portal - CustomiseMe UK</title>
            </Helmet>

            <div className="container">
                <header className="mb-5 d-flex justify-content-between align-items-center">
                    <div>
                        <h1 className="h2 fw-bold mb-0 text-uppercase">ADMIN PORTAL</h1>
                        <p className="text-muted mb-0">Logged in as {user.email}</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-dark btn-sm rounded-pill" onClick={() => window.location.reload()}>Refresh Data</button>
                    </div>
                </header>

                <div className="row g-4">
                    {/* Sidebar Navigation */}
                    <div className="col-lg-3">
                        <div className="card border-0 shadow-sm p-3 rounded-4">
                            <nav className="nav flex-column nav-pills">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        className={`nav-link text-start py-3 mb-2 rounded-3 border-0 bg-transparent ${activeTab === tab.id ? 'active bg-dark text-white fw-bold shadow-sm' : 'text-muted'}`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        {tab.label.toUpperCase()}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content Area */}
                    <div className="col-lg-9">
                        <div className="card border-0 shadow-sm p-4 rounded-4 min-vh-50">
                            {activeTab === 'products' && <AdminProducts />}
                            {activeTab === 'upload' && <AdminUpload />}
                            {activeTab === 'orders' && <AdminOrders />}
                            {activeTab === 'custom-orders' && <AdminCustomOrders />}
                            {activeTab === 'reviews' && <AdminReviews />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
