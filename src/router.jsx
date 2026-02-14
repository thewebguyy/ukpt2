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
import DesignService from './pages/DesignService';
import PremiumServices from './pages/PremiumServices';
import Resources from './pages/Resources';
import SendItems from './pages/SendItems';
import Installation from './pages/Installation';
import Workshop from './pages/Workshop';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Subscriptions from './pages/Subscriptions';
import OrderTracking from './pages/OrderTracking';
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
            { path: 'designstudio', element: <DesignStudio /> },
            { path: 'designservice', element: <DesignService /> },
            { path: 'premiumservices', element: <PremiumServices /> },
            { path: 'resources', element: <Resources /> },
            { path: 'senditems', element: <SendItems /> },
            { path: 'installation', element: <Installation /> },
            { path: 'workshop', element: <Workshop /> },
            { path: 'wishlist', element: <Wishlist /> },
            { path: 'contact', element: <Contact /> },
            { path: 'faq', element: <FAQ /> },
            { path: 'about', element: <About /> },
            { path: 'privacy-policy', element: <Privacy /> },
            { path: 'terms-conditions', element: <Terms /> },
            { path: 'subscriptions', element: <Subscriptions /> },
            { path: 'order-tracking', element: <OrderTracking /> },
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
