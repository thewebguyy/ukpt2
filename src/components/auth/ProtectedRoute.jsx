import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ADMIN_EMAILS } from '../../config/admin';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuthStore();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/account" replace />;
    }

    if (adminOnly && !ADMIN_EMAILS.includes(user.email)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
