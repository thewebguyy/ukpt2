import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Icons from '../common/Icons';
import CartOffcanvas from '../cart/CartOffcanvas';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Layout = () => {
    const { pathname } = useLocation();
    const initListener = useAuthStore(state => state.initListener);
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo(0, 0);

        // Simple navigation progress simulation
        setIsNavigating(true);
        const timer = setTimeout(() => setIsNavigating(false), 500);
        return () => clearTimeout(timer);
    }, [pathname]);

    useEffect(() => {
        // Initialize Auth Listener
        const unsubscribe = initListener();
        return () => unsubscribe();
    }, [initListener]);

    return (
        <div className="site-wrapper">
            <Icons />
            <AnimatePresence mode="wait">
                {isNavigating && (
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="progress-bar-top"
                    />
                )}
            </AnimatePresence>
            <Header />
            <main id="main-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
            <CartOffcanvas />
        </div>
    );
};

export default Layout;
