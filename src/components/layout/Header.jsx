import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import MobileMenu from './MobileMenu';
import MegaMenu from './MegaMenu';

const Header = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const cartItems = useCartStore(state => state.items);
    const wishlistItems = useWishlistStore(state => state.items);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = wishlistItems.length;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const getGreeting = () => {
        if (user && user.name) {
            const firstName = user.name.split(' ')[0].toUpperCase();
            return `HI, ${firstName}`;
        }
        return user ? "HI, USER" : "SIGN IN / SIGN UP";
    };

    return (
        <header className="site-header">
            {/* Announcement Banner */}
            <div className="announcement-banner">
                <div className="announcement-content">
                    <span className="announcement-item">FREE DELIVERY OVER £100</span>
                    <span className="announcement-item">CONTACT US</span>
                    <span className="announcement-item">INFO@CUSTOMISEMEUK.COM</span>
                    <span className="announcement-item">07588770901</span>
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="announcement-item d-none d-md-inline">
                            {i % 2 === 0 ? "NEW ARRIVALS WEEKLY" : "CUSTOM DESIGNS AVAILABLE"}
                        </span>
                    ))}
                </div>
            </div>

            {/* Top Bar */}
            <div className="top-bar">
                <div className="container">
                    <div className="top-bar-content">
                        {/* Mobile Toggle */}
                        <button
                            className="navbar-toggler d-lg-none"
                            type="button"
                            onClick={() => setIsMobileMenuOpen(true)}
                            style={{ order: 1 }}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        {/* Logo */}
                        <Link to="/" className="navbar-brand" style={{ order: 2 }}>
                            <img src="/icon.png" alt="CustomiseMe UK" className="logo-image" />
                        </Link>

                        {/* Search Bar (Desktop) */}
                        <form className="search-bar-form-compact d-none d-lg-flex" style={{ order: 4 }} onSubmit={handleSearch}>
                            <button type="submit" className="bg-transparent border-0 p-0" aria-label="Search">
                                <svg className="search-icon">
                                    <use xlinkHref="#icon-search" />
                                </svg>
                            </button>
                            <input
                                type="search"
                                className="search-input"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>

                        {/* Right Icons */}
                        <div className="d-flex align-items-center gap-1 gap-md-3 nav-header-icons" style={{ order: 3 }}>
                            {/* Globe/Region Dropdown (Desktop) */}
                            <div className="dropdown d-none d-md-block">
                                <a href="#" className="nav-icon" data-bs-toggle="dropdown">
                                    <svg className="icon"><use xlinkHref="#icon-globe" /></svg>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end region-dropdown">
                                    <li><a className="dropdown-item" href="#">🇬🇧 UNITED KINGDOM</a></li>
                                    <li><a className="dropdown-item" href="#">🇪🇺 EUROPE</a></li>
                                    <li><a className="dropdown-item" href="#">🇺🇸 AMERICA</a></li>
                                </ul>
                            </div>

                            {/* Wishlist */}
                            <Link to="/wishlist" className="nav-icon">
                                <svg className="icon"><use xlinkHref="#icon-heart" /></svg>
                                {wishlistCount > 0 && <span className="badge-wishlist has-items">{wishlistCount}</span>}
                            </Link>

                            {/* Cart */}
                            <button
                                className="nav-icon border-0 bg-transparent"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#cartOffcanvas"
                            >
                                <svg className="icon"><use xlinkHref="#icon-shopping-bag" /></svg>
                                {cartCount > 0 && <span className="badge-cart has-items">{cartCount}</span>}
                            </button>

                            {/* User Account */}
                            <Link to="/account" className="nav-icon nav-icon-text">
                                <svg className="icon"><use xlinkHref="#icon-user" /></svg>
                                <span className="nav-text d-none d-md-inline">{getGreeting()}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Main Navigation - Single source of truth for entire site */}
            <nav className="main-nav d-none d-lg-block">
                <div className="container">
                    <ul className="navbar-nav mx-auto">
                        {/* SHOP MEGA MENU */}
                        <MegaMenu title="SHOP" link="/shop">
                            <div className="row">
                                <div className="col-md-3">
                                    <h6 className="mega-title">Categories</h6>
                                    <Link className="dropdown-item" to="/shop">All Products</Link>
                                    <Link className="dropdown-item" to="/shop?category=apparel">Apparel</Link>
                                    <Link className="dropdown-item" to="/shop?category=party-decor">Decorations</Link>
                                    <Link className="dropdown-item" to="/shop?category=stickers">Prints</Link>
                                    <Link className="dropdown-item" to="/shop?category=accessories">Accessories</Link>
                                </div>
                                <div className="col-md-3">
                                    <h6 className="mega-title">Apparel</h6>
                                    <Link className="dropdown-item" to="/shop?category=apparel">T-Shirts</Link>
                                    <Link className="dropdown-item" to="/shop?category=apparel">Hoodies</Link>
                                    <Link className="dropdown-item" to="/shop?category=apparel">Bags</Link>
                                </div>
                                <div className="col-md-3">
                                    <h6 className="mega-title">Party Essentials</h6>
                                    <Link className="dropdown-item" to="/shop?category=party-decor">Vinyl Banners</Link>
                                    <Link className="dropdown-item" to="/shop?category=party-decor">Plates, Cups, Utensils</Link>
                                    <Link className="dropdown-item" to="/shop?category=party-decor">Table Decor</Link>
                                    <Link className="dropdown-item" to="/shop?category=party-decor">Party Packs</Link>
                                    <Link className="dropdown-item" to="/shop?category=party-decor">Cake Decor</Link>
                                </div>
                                <div className="col-md-3">
                                    <h6 className="mega-title">Stickers & Labels</h6>
                                    <Link className="dropdown-item" to="/shop?category=stickers">Vinyl Stickers</Link>
                                    <Link className="dropdown-item" to="/shop?category=stickers">Custom Labels</Link>
                                    <Link className="dropdown-item" to="/shop?category=stickers">Wall Decals</Link>
                                    <Link className="dropdown-item" to="/shop?category=stickers">Sticker Packs</Link>
                                </div>
                            </div>
                        </MegaMenu>

                        {/* DESIGN STUDIO MEGA MENU */}
                        <MegaMenu title="DESIGN STUDIO" link="/designstudio">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="mega-title">Services</h6>
                                    <Link className="dropdown-item" to="/designservice">Design Services</Link>
                                    <Link className="dropdown-item" to="/designstudio#mockup">Mockup Generation</Link>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="mega-title">Resources</h6>
                                    <Link className="dropdown-item" to="/designstudio#resources">Design Templates</Link>
                                    <Link className="dropdown-item" to="/designstudio#resources">Style Guide</Link>
                                    <Link className="dropdown-item" to="/designstudio#resources">FAQs</Link>
                                </div>
                            </div>
                        </MegaMenu>

                        {/* PREMIUM SERVICES MEGA MENU */}
                        <MegaMenu title="PREMIUM SERVICES" link="/premiumservices">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="mega-title">Services</h6>
                                    <Link className="dropdown-item" to="/senditems">Send Items In</Link>
                                    <Link className="dropdown-item" to="/subscriptions">Subscriptions</Link>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="mega-title">Installation</h6>
                                    <Link className="dropdown-item" to="/installation">Vinyl Installation</Link>
                                    <Link className="dropdown-item" to="/premiumservices#event-setup">Setup at Event</Link>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="mega-title">Workshops</h6>
                                    <Link className="dropdown-item" to="/workshop">Group Workshop</Link>
                                    <Link className="dropdown-item" to="/workshop">Station Experience</Link>
                                </div>
                            </div>
                        </MegaMenu>
                    </ul>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </header>
    );
};

export default Header;
