import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard from './pages/admin/AdminDashboard';
import DesignStudio from './pages/DesignStudio';
import ProtectedRoute from './components/auth/ProtectedRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'shop', element: <Shop /> },
            { path: 'product/:id', element: <ProductDetail /> },
            { path: 'account', element: <Account /> },
            { path: 'checkout', element: <Checkout /> },
            { path: 'order-confirmation', element: <OrderConfirmation /> },
            { path: 'design-studio', element: <DesignStudio /> },
            {
                path: 'dashboard',
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'admin',
                element: (
                    <ProtectedRoute adminOnly>
                        <AdminDashboard />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export default router;
