import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../../../services/firebase';
import { collection, getDocs, updateDoc, doc, orderBy, query } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { EmailService } from '../../../services/email.service';

const AdminOrders = () => {
    const queryClient = useQueryClient();

    const { data: orders, isLoading } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ order, status }) => {
            await updateDoc(doc(db, 'orders', order.id), { status });
            if (status === 'shipped' && order.email) {
                const firstName = (order.shippingAddress?.name || '').trim().split(' ')[0] || 'Customer';
                await EmailService.sendShippingNotification({
                    email: order.email,
                    firstName,
                    orderId: order.id,
                    trackingNumber: order.trackingNumber || 'Will be updated shortly',
                    carrier: order.carrier || 'Royal Mail',
                    estimatedDelivery: order.estimatedDelivery || '3-5 business days'
                });
            }
        },
        onSuccess: (_, { status }) => {
            queryClient.invalidateQueries(['admin-orders']);
            toast.success(status === 'shipped' ? 'Order marked shipped & notification sent' : 'Order status updated');
        },
        onError: (err, { order, status }) => {
            queryClient.invalidateQueries(['admin-orders']);
            toast.error(status === 'shipped' ? 'Status updated but shipping email failed' : err.message);
        }
    });

    const handleStatusChange = (order, newStatus) => {
        updateStatusMutation.mutate({ order, status: newStatus });
    };

    if (isLoading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;

    return (
        <div>
            <h2 className="h4 fw-bold mb-4">MANAGE ORDERS</h2>
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light text-uppercase small fw-bold">
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th className="text-end">Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map(order => (
                            <tr key={order.id}>
                                <td>
                                    <span className="fw-bold">{order.id}</span>
                                    {order.hasCustomArtwork && <span className="ms-2 badge bg-info">CUSTOM</span>}
                                </td>
                                <td>
                                    <div className="fw-bold">{order.shippingAddress?.name || '---'}</div>
                                    <div className="small text-muted">{order.email}</div>
                                </td>
                                <td className="fw-bold">£{order.total?.toFixed(2)}</td>
                                <td>
                                    <span className={`badge rounded-pill px-3 ${order.status === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                        {(order.status || 'pending').toUpperCase()}
                                    </span>
                                </td>
                                <td className="small">
                                    {order.createdAt?.toDate
                                        ? new Date(order.createdAt.toDate()).toLocaleDateString()
                                        : order.createdAt
                                            ? new Date(order.createdAt).toLocaleDateString()
                                            : 'N/A'}
                                </td>
                                <td className="text-end">
                                    <select
                                        className="form-select form-select-sm d-inline-block w-auto"
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!orders || orders.length === 0) && (
                    <div className="text-center py-5 text-muted">No orders found.</div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
