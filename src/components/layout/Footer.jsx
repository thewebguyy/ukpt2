import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NewsletterService } from '../../services/newsletter.service';
import { toast } from 'react-hot-toast';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsSubscribing(true);
        try {
            const result = await NewsletterService.subscribe(email.trim());
            if (result.success) {
                toast.success('Successfully subscribed to our newsletter!');
                setEmail('');
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <footer style={{ backgroundColor: '#f8f9fa', padding: '4rem 0' }}>
            <div className="container">
                <div className="row">
                    {/* About */}
                    <div className="col-md-3 footer-section mb-4 mb-md-0">
                        <h3 className="footer-title">ABOUT US</h3>
                        <p className="text-grey-dark">
                            CustomiseMe UK offers premium designs, custom prints, and party essentials
                            crafted with care. We're dedicated to helping you create memorable moments and standout branding.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-md-3 footer-section mb-4 mb-md-0">
                        <h3 className="footer-title">QUICK LINKS</h3>
                        <ul className="footer-links list-unstyled">
                            <li><Link to="/shop">SHOP</Link></li>
                            <li><Link to="/designstudio">DESIGN STUDIO</Link></li>
                            <li><Link to="/senditems">SEND ITEMS</Link></li>
                            <li><Link to="/workshop">WORKSHOP</Link></li>
                            <li><Link to="/contact">CONTACT</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/privacy-policy">PRIVACY POLICY</Link></li>
                            <li><Link to="/terms-conditions">TERMS & CONDITIONS</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-md-3 footer-section mb-4 mb-md-0">
                        <h3 className="footer-title">NEWSLETTER</h3>
                        <p className="text-grey-dark small">Subscribe for exclusive offers, new arrivals, and 10% off your first order.</p>
                        <form onSubmit={handleSubscribe}>
                            <div className="d-flex gap-2">
                                <input
                                    type="email"
                                    className="form-control form-control-sm"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="btn btn-dark btn-sm flex-shrink-0"
                                    disabled={isSubscribing}
                                >
                                    {isSubscribing ? '...' : 'JOIN'}
                                </button>
                            </div>
                            <p className="text-muted mt-1 mb-0" style={{ fontSize: '0.7rem' }}>
                                By subscribing you agree to our <Link to="/privacy-policy" className="text-decoration-underline text-muted">Privacy Policy</Link>. Unsubscribe anytime.
                            </p>
                        </form>
                    </div>

                    {/* Contact */}
                    <div className="col-md-3 footer-section">
                        <h3 className="footer-title">CONTACT US</h3>
                        <p className="text-grey-dark">
                            <strong>EMAIL:</strong><br />
                            <a href="mailto:info@customisemeuk.com">info@customisemeuk.com</a>
                        </p>
                        <p className="text-grey-dark mb-3">
                            <strong>PHONE:</strong><br />
                            <a href="tel:07588770901">07588770901</a>
                        </p>
                        <div className="social-links">
                            <a href="https://www.instagram.com/customisemeuk" target="_blank" rel="noopener noreferrer" className="social-link">
                                <svg className="icon-sm">
                                    <use xlinkHref="#icon-instagram" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4 pt-4" style={{ borderTop: '1px solid var(--color-grey-light)' }}>
                    {/* Trust Badges & Payment Methods */}
                    <div className="mb-3 d-flex justify-content-center gap-3 align-items-center flex-wrap">
                        <span className="d-flex align-items-center gap-1 text-grey-dark">
                            <svg className="icon-sm">
                                <use xlinkHref="#icon-star" />
                            </svg>
                            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Secure Checkout</span>
                        </span>
                        <span className="text-grey-light">|</span>
                        <span className="d-flex align-items-center gap-2">
                            <span style={{ border: '1px solid #e5e5e5', padding: '2px 6px', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 700, background: 'white', color: '#1a1f36' }}>VISA</span>
                            <span style={{ border: '1px solid #e5e5e5', padding: '2px 6px', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 700, background: 'white', color: '#1a1f36' }}>MC</span>
                            <span style={{ border: '1px solid #e5e5e5', padding: '2px 6px', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 700, background: 'white', color: '#006fcf' }}>AMEX</span>
                        </span>
                    </div>

                    <p className="text-grey-dark mb-2" style={{ fontSize: '0.8rem' }}>
                        <Link to="/terms-conditions" className="text-decoration-none text-grey-dark">Return Policy</Link> |{' '}
                        <Link to="/privacy-policy" className="text-decoration-none text-grey-dark">Privacy Policy</Link> |{' '}
                        <Link to="/terms-conditions" className="text-decoration-none text-grey-dark">Terms of Service</Link>
                    </p>
                    <p className="text-grey-dark mb-0" style={{ fontSize: '0.8rem' }}>© 2026 Customise Me UK. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
