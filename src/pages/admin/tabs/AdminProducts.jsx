import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, functions } from '../../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { toast } from 'react-hot-toast';

const AdminProducts = () => {
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            const snap = await getDocs(collection(db, 'products'));
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const deleteFn = httpsCallable(functions, 'deleteProduct');
            const result = await deleteFn({ productId: id });
            if (!result.data.success) throw new Error('Delete failed');
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-products']);
            toast.success('Product deleted');
        },
        onError: (err) => toast.error('Failed to delete product: ' + err.message)
    });

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;

    return (
        <div>
            <h2 className="h4 fw-bold mb-4">MANAGE PRODUCTS</h2>
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr className="small text-uppercase fw-bold">
                            <th>Preview</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <img src={p.imageUrl || '/placeholder.png'} alt={p.name} className="rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                </td>
                                <td>
                                    <div className="fw-bold">{p.name}</div>
                                    <div className="small text-muted text-truncate" style={{ maxWidth: '200px' }}>{p.id}</div>
                                </td>
                                <td><span className="badge bg-light text-dark text-capitalize">{p.category}</span></td>
                                <td className="fw-bold">£{p.price?.toFixed(2)}</td>
                                <td className="text-end">
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)} disabled={deleteMutation.isPending}>
                                        {deleteMutation.isPending && deleteMutation.variables === p.id ? '...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!products || products.length === 0) && (
                    <div className="text-center py-5 text-muted">No products found.</div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
