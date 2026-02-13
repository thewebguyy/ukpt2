import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Icons from '../common/Icons';
import CartOffcanvas from '../cart/CartOffcanvas';
import { useAuthStore } from '../../store/authStore';

const Layout = () => {
    const { pathname } = useLocation();
    const initListener = useAuthStore(state => state.initListener);

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        // Initialize Auth Listener
        const unsubscribe = initListener();
        return () => unsubscribe();
    }, [initListener]);

    return (
        <div className="site-wrapper">
            <Icons />
            <Header />
            <main id="main-content">
                <Outlet />
            </main>
            <Footer />
            <CartOffcanvas />
        </div>
    );
};

export default Layout;
