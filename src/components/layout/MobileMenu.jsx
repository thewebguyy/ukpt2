import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const MobileMenu = ({ isOpen, onClose }) => {
    const [activeView, setActiveView] = useState('main');
    const { user } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    // Reset view when menu opens or location changes
    useEffect(() => {
        if (isOpen) {
            setActiveView('main');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, location]);

    if (!isOpen) return null;

    const views = {
        main: (
            <ul className="mobile-menu-list">
                <li>
                    <button className="mobile-menu-item" onClick={() => setActiveView('shop')}>
                        <span>SHOP</span>
                        <svg className="icon-chevron"><use xlinkHref="#icon-chevron-right" /></svg>
                    </button>
                </li>
                <li>
                    <button className="mobile-menu-item" onClick={() => setActiveView('design')}>
                        <span>DESIGN STUDIO</span>
                        <svg className="icon-chevron"><use xlinkHref="#icon-chevron-right" /></svg>
                    </button>
                </li>
                <li>
                    <button className="mobile-menu-item" onClick={() => setActiveView('premium')}>
                        <span>PREMIUM SERVICES</span>
                        <svg className="icon-chevron"><use xlinkHref="#icon-chevron-right" /></svg>
                    </button>
                </li>
            </ul>
        ),
        shop: (
            <>
                <button className="mobile-menu-back" onClick={() => setActiveView('main')}>
                    <svg><use xlinkHref="#icon-chevron-left" /></svg>
                    <span>SHOP</span>
                </button>
                <ul className="mobile-menu-list">
                    <li><Link to="/shop" className="mobile-menu-item" onClick={onClose}><span>ALL PRODUCTS</span></Link></li>
                    <li><Link to="/shop?category=apparel" className="mobile-menu-item" onClick={onClose}><span>APPAREL</span></Link></li>
                    <li><Link to="/shop?category=party-decor" className="mobile-menu-item" onClick={onClose}><span>DECORATIONS</span></Link></li>
                    <li><Link to="/shop?category=stickers" className="mobile-menu-item" onClick={onClose}><span>PRINTS</span></Link></li>
                </ul>
            </>
        ),
        design: (
            <>
                <button className="mobile-menu-back" onClick={() => setActiveView('main')}>
                    <svg><use xlinkHref="#icon-chevron-left" /></svg>
                    <span>DESIGN STUDIO</span>
                </button>
                <ul className="mobile-menu-list">
                    <li><Link to="/design-studio" className="mobile-menu-item" onClick={onClose}><span>DESIGN SERVICES</span></Link></li>
                    <li><Link to="/design-studio#resources" className="mobile-menu-item" onClick={onClose}><span>DESIGN TEMPLATES</span></Link></li>
                </ul>
            </>
        ),
        premium: (
            <>
                <button className="mobile-menu-back" onClick={() => setActiveView('main')}>
                    <svg><use xlinkHref="#icon-chevron-left" /></svg>
                    <span>PREMIUM SERVICES</span>
                </button>
                <ul className="mobile-menu-list">
                    <li><Link to="/subscriptions" className="mobile-menu-item" onClick={onClose}><span>SUBSCRIPTIONS</span></Link></li>
                </ul>
            </>
        )
    };

    return (
        <div className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`} id="mobileMenuOverlay">
            <div className="mobile-menu-container">
                <div className="mobile-menu-header">
                    <Link to="/" className="mobile-menu-logo" onClick={onClose}>
                        <img src="/icon.png" alt="Creative Merch UK" />
                    </Link>
                    <button className="mobile-menu-close" onClick={onClose}>
                        <svg><use xlinkHref="#icon-x" /></svg>
                    </button>
                </div>

                <div className="mobile-menu-search">
                    <form className="mobile-search-form" onSubmit={(e) => {
                        e.preventDefault();
                        const query = e.target.search.value;
                        if (query) {
                            navigate(`/shop?search=${encodeURIComponent(query)}`);
                            onClose();
                        }
                    }}>
                        <svg><use xlinkHref="#icon-search" /></svg>
                        <input name="search" type="search" placeholder="Search products..." />
                    </form>
                </div>

                <div className="mobile-menu-content">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {views[activeView]}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mobile-menu-footer">
                    <Link to="/account" className="mobile-menu-footer-item" onClick={onClose}>
                        <svg><use xlinkHref="#icon-user" /></svg>
                        <span className="nav-text">
                            {user ? `HI, ${user.name.split(' ')[0].toUpperCase()}` : 'LOG IN'}
                        </span>
                    </Link>
                    <Link to="/contact" className="mobile-menu-footer-item" onClick={onClose}>
                        <svg><use xlinkHref="#icon-instagram" /></svg>
                        <span>CONTACT US</span>
                    </Link>
                    <div className="mobile-menu-footer-item">
                        <span style={{ fontSize: '1.2rem' }}>🇬🇧</span>
                        <span>GBP £</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
