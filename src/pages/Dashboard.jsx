import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { OrderService } from '../services/order.service';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
    const { user, logout } = useAuthStore();

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders', user?.email],
        queryFn: () => OrderService.getUserOrders(user?.email),
        enabled: !!user
    });

    return (
        <div className="dashboard-page py-5">
            <Helmet>
                <title>My Dashboard - CustomiseMe UK</title>
            </Helmet>

            <div className="container">
                <div className="row g-4">
                    {/* Sidebar / Profile Info */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm p-4 rounded-4 text-center">
                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                                <span className="h2 mb-0 fw-bold">{user?.name?.charAt(0) || 'U'}</span>
                            </div>
                            <h4 className="fw-bold mb-1">{user?.name}</h4>
                            <p className="text-muted small mb-3">{user?.email}</p>

                            <div className="d-grid gap-2">
                                <button className="btn btn-outline-dark btn-sm rounded-pill">Edit Profile</button>
                                <button className="btn btn-dark btn-sm rounded-pill" onClick={logout}>Log Out</button>
                            </div>
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
                                                <td>{order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A'}</td>
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
                                <a href="/shop" className="btn btn-link fw-bold text-dark text-decoration-none mt-2">Start Shopping &rarr;</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
