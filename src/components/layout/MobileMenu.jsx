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
                    <li><Link to="/shop" className="mobile-menu-item" onClick={onClose}><span>All Products</span></Link></li>
                    <li><Link to="/shop?category=apparel" className="mobile-menu-item" onClick={onClose}><span>Apparel</span></Link></li>
                    <li><Link to="/shop?category=party-decor" className="mobile-menu-item" onClick={onClose}><span>Decorations</span></Link></li>
                    <li><Link to="/shop?category=stickers" className="mobile-menu-item" onClick={onClose}><span>Prints</span></Link></li>
                    <li><Link to="/shop?category=accessories" className="mobile-menu-item" onClick={onClose}><span>Accessories</span></Link></li>
                    <li><Link to="/shop?category=apparel" className="mobile-menu-item" onClick={onClose}><span>T-Shirts</span></Link></li>
                    <li><Link to="/shop?category=apparel" className="mobile-menu-item" onClick={onClose}><span>Hoodies</span></Link></li>
                    <li><Link to="/shop?category=apparel" className="mobile-menu-item" onClick={onClose}><span>Bags</span></Link></li>
                    <li><Link to="/shop?category=party-decor" className="mobile-menu-item" onClick={onClose}><span>Vinyl Banners</span></Link></li>
                    <li><Link to="/shop?category=party-decor" className="mobile-menu-item" onClick={onClose}><span>Plates, Cups, Utensils</span></Link></li>
                    <li><Link to="/shop?category=party-decor" className="mobile-menu-item" onClick={onClose}><span>Table Decor</span></Link></li>
                    <li><Link to="/shop?category=party-decor" className="mobile-menu-item" onClick={onClose}><span>Party Packs</span></Link></li>
                    <li><Link to="/shop?category=party-decor" className="mobile-menu-item" onClick={onClose}><span>Cake Decor</span></Link></li>
                    <li><Link to="/shop?category=stickers" className="mobile-menu-item" onClick={onClose}><span>Vinyl Stickers</span></Link></li>
                    <li><Link to="/shop?category=stickers" className="mobile-menu-item" onClick={onClose}><span>Custom Labels</span></Link></li>
                    <li><Link to="/shop?category=stickers" className="mobile-menu-item" onClick={onClose}><span>Wall Decals</span></Link></li>
                    <li><Link to="/shop?category=stickers" className="mobile-menu-item" onClick={onClose}><span>Sticker Packs</span></Link></li>
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
                    <li><Link to="/designstudio" className="mobile-menu-item" onClick={onClose}><span>Design Studio</span></Link></li>
                    <li><Link to="/designservice" className="mobile-menu-item" onClick={onClose}><span>Design Services</span></Link></li>
                    <li><Link to="/designstudio#mockup" className="mobile-menu-item" onClick={onClose}><span>Mockup Generation</span></Link></li>
                    <li><Link to="/designstudio#resources" className="mobile-menu-item" onClick={onClose}><span>Design Templates</span></Link></li>
                    <li><Link to="/designstudio#resources" className="mobile-menu-item" onClick={onClose}><span>Style Guide</span></Link></li>
                    <li><Link to="/designstudio#resources" className="mobile-menu-item" onClick={onClose}><span>FAQs</span></Link></li>
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
                    <li><Link to="/senditems" className="mobile-menu-item" onClick={onClose}><span>Send Items In</span></Link></li>
                    <li><Link to="/subscriptions" className="mobile-menu-item" onClick={onClose}><span>Subscriptions</span></Link></li>
                    <li><Link to="/installation" className="mobile-menu-item" onClick={onClose}><span>Vinyl Installation</span></Link></li>
                    <li><Link to="/premiumservices#event-setup" className="mobile-menu-item" onClick={onClose}><span>Setup at Event</span></Link></li>
                    <li><Link to="/workshop" className="mobile-menu-item" onClick={onClose}><span>Group Workshop</span></Link></li>
                    <li><Link to="/workshop" className="mobile-menu-item" onClick={onClose}><span>Station Experience</span></Link></li>
                </ul>
            </>
        )
    };

    return (
        <div className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`} id="mobileMenuOverlay">
            <div className="mobile-menu-container">
                <div className="mobile-menu-header">
                    <Link to="/" className="mobile-menu-logo" onClick={onClose}>
                        <img src="/icon.png" alt="CustomiseMe UK" />
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
                            {user ? `HI, ${user?.name ? user.name.split(' ')[0].toUpperCase() : 'USER'}` : 'LOG IN'}
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
