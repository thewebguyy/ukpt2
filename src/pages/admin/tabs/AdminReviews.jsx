import { useQuery } from '@tanstack/react-query';

const AdminReviews = () => {
    const { data: reviews, isLoading } = useQuery({
        queryKey: ['admin-reviews'],
        queryFn: async () => {
            // TODO: Implement proper review fetching from all products
            return [];
        }
    });

    return (
        <div>
            <h2 className="h4 fw-bold mb-4">MANAGE REVIEWS</h2>
            <div className="alert alert-info">
                <p className="mb-0">Review management system coming soon. Reviews will be moderated before appearing on products.</p>
            </div>
            {isLoading ? (
                <div className="text-center py-5"><div className="spinner-border"></div></div>
            ) : (
                <p className="text-muted">No reviews to moderate at this time.</p>
            )}
        </div>
    );
};

export default AdminReviews;
