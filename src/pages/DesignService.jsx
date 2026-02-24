import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const DesignService = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        projectType: '',
        name: '',
        email: '',
        phone: '',
        description: '',
        date: '',
        time: '',
        notes: '',
        feedback: '',
        approved: false
    });

    const progress = (step - 1) * 33.33;

    const handleNext = (e) => {
        e.preventDefault();
        if (step < 4) setStep(step + 1);
        window.scrollTo(0, 0);
    };

    const resetForm = () => {
        setStep(1);
        setFormData({
            projectType: '',
            name: '',
            email: '',
            phone: '',
            description: '',
            date: '',
            time: '',
            notes: '',
            feedback: '',
            approved: false
        });
        window.scrollTo(0, 0);
    };

    return (
        <div className="design-service-page bg-light min-vh-100">
            <Helmet>
                <title>Design Service - CustomiseMe UK</title>
            </Helmet>

            <style>{`
                .step-container {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .step-progress {
                    height: 4px;
                    background: #e9ecef;
                    width: 100%;
                    margin-bottom: 3rem;
                    position: relative;
                }
                .progress-fill {
                    height: 100%;
                    background: var(--color-black, #000);
                    transition: width 0.4s ease;
                }
                .step-card {
                    background: #fff;
                    border: 1px solid #dee2e6;
                    border-radius: 12px;
                    padding: 2.5rem;
                    position: relative;
                    margin-bottom: 2rem;
                    transition: all 0.3s ease;
                    display: none;
                }
                .step-card.active {
                    display: block;
                    border-color: var(--color-black, #000);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                }
                .step-card.completed {
                    display: block;
                    opacity: 0.7;
                    border-color: #dee2e6;
                }
                .step-number {
                    position: absolute;
                    top: -20px;
                    left: 2rem;
                    background: var(--color-black, #000);
                    color: #fff;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1.1rem;
                    z-index: 2;
                }
                .delivery-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .format-card {
                    border: 1px solid #eee;
                    padding: 1rem;
                    border-radius: 8px;
                    text-align: center;
                }
                .header-stack {
                    position: sticky;
                    top: 0;
                    z-index: 1040;
                    background: #fff;
                }
                .icon-header {
                    width: 20px;
                    height: 20px;
                }
                @media (max-width: 768px) {
                    .delivery-grid {
                        grid-template-columns: 1fr;
                    }
                    .step-card {
                        padding: 1.5rem;
                    }
                }
            `}</style>

            {/* Fixed Header Stack (Inline) */}
            <div className="header-stack border-bottom">
                <div className="announcement-banner bg-light py-2 border-bottom">
                    <div className="container text-center small fw-bold text-uppercase d-flex justify-content-center gap-4">
                        <span>Free Delivery Over £100</span>
                        <span className="d-none d-md-inline">|</span>
                        <span>Custom Designs Available</span>
                    </div>
                </div>
                <div className="top-bar py-3">
                    <div className="container d-flex justify-content-between align-items-center">
                        <Link to="/" className="navbar-brand">
                            <img src="/icon.png" alt="CustomiseMe UK" style={{ height: '40px' }} />
                        </Link>
                        <div className="search-bar d-none d-lg-block flex-grow-1 mx-5">
                            <div className="position-relative">
                                <input type="text" className="form-control bg-light border-0 py-2 ps-4" placeholder="Search designs..." />
                                <svg className="position-absolute end-0 top-50 translate-middle-y me-3" width="16" height="16">
                                    <use xlinkHref="#icon-search" />
                                </svg>
                            </div>
                        </div>
                        <div className="icons d-flex gap-3 align-items-center">
                            <Link to="/wishlist" className="text-dark">
                                <svg width="24" height="24"><use xlinkHref="#icon-heart" /></svg>
                            </Link>
                            <button className="btn p-0 text-dark border-0">
                                <svg width="24" height="24"><use xlinkHref="#icon-shopping-bag" /></svg>
                            </button>
                            <Link to="/account" className="text-dark">
                                <svg width="24" height="24"><use xlinkHref="#icon-user" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="main-nav py-2 border-top">
                    <div className="container">
                        <ul className="nav justify-content-center fw-bold small">
                            <li className="nav-item"><Link className="nav-link text-dark py-1" to="/shop">SHOP</Link></li>
                            <li className="nav-item"><Link className="nav-link text-dark py-1" to="/designstudio">DESIGN STUDIO</Link></li>
                            <li className="nav-item"><Link className="nav-link text-dark py-1" to="/premiumservices">PREMIUM SERVICES</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Design Service Hero */}
            <section className="section py-5">
                <div className="container text-center">
                    <h1 className="fw-bold mb-3 display-4 text-uppercase">Design Service</h1>
                    <p className="text-muted h5 fw-light mx-auto" style={{ maxWidth: '600px' }}>Bring your creative visions to life with our expert design team, from concept to delivery.</p>
                </div>
            </section>

            {/* Step Progress Container */}
            <div className="step-container py-4 pb-5 px-3">
                <div className="step-progress">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                {/* Step 1 Card */}
                <div className={`step-card ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-content">
                        <h3 className="fw-bold mb-3 text-uppercase">1. Project Details</h3>
                        <p className="text-muted mb-4 small">Tell us what you're looking to create and we'll handle the rest.</p>

                        <form onSubmit={handleNext}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-uppercase">Project Type</label>
                                <select
                                    className="form-select form-select-lg bg-light border-0"
                                    value={formData.projectType}
                                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                                    required
                                >
                                    <option value="">Select a type...</option>
                                    <option value="apparel">Custom Apparel (T-shirts, Hoodies)</option>
                                    <option value="banner">Promotional Vinyl Banner</option>
                                    <option value="stickers">Custom Sticker / Label Design</option>
                                    <option value="logo">Logo & Brand Identity</option>
                                    <option value="other">Other Unique Design</option>
                                </select>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-uppercase">Full Name</label>
                                    <input type="text" className="form-control form-control-lg bg-light border-0" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Alex Smith" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-uppercase">Email Address</label>
                                    <input type="email" className="form-control form-control-lg bg-light border-0" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="alex@example.com" />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-uppercase">Phone Number</label>
                                <input type="tel" className="form-control form-control-lg bg-light border-0" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Optional" />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase">Project Description</label>
                                <textarea className="form-control bg-light border-0" rows="4" placeholder="Describe your vision, colors, and any specific requirements..." required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <button type="submit" className="btn btn-dark btn-lg w-100 rounded-pill fw-bold py-3 shadow-sm">CONTINUE TO BOOKING &rarr;</button>
                        </form>
                    </div>
                </div>

                {/* Step 2 Card */}
                <div className={`step-card ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-content">
                        <div className="alert alert-success border-0 rounded-4 d-flex align-items-center gap-3 mb-4">
                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <svg width="20" height="20" className="text-success"><use xlinkHref="#icon-star" /></svg>
                            </div>
                            <div className="small"><strong>DETAILS RECEIVED!</strong> Now, schedule your design consultation slot.</div>
                        </div>
                        <h3 className="fw-bold mb-3 text-uppercase">2. Book Consultation</h3>
                        <p className="text-muted mb-4 small">Select a time for a quick 15-minute call to finalize requirements.</p>

                        <form onSubmit={handleNext}>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-uppercase">Preferred Date</label>
                                    <input type="date" className="form-control form-control-lg bg-light border-0" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-uppercase">Time Slot</label>
                                    <select className="form-select form-select-lg bg-light border-0" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}>
                                        <option value="">Choose time...</option>
                                        <option>09:00 - 10:00 (GMT)</option>
                                        <option>11:00 - 12:00 (GMT)</option>
                                        <option>14:00 - 15:00 (GMT)</option>
                                        <option>16:00 - 17:00 (GMT)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase">Additional Notes</label>
                                <textarea className="form-control bg-light border-0" rows="3" placeholder="Anything else we should know?" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}></textarea>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-outline-dark btn-lg rounded-pill px-4" onClick={() => setStep(1)}>&larr;</button>
                                <button type="submit" className="btn btn-dark btn-lg flex-grow-1 rounded-pill fw-bold">CONFIRM & VIEW DRAFTS</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Step 3 Card */}
                <div className={`step-card ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-content">
                        <h3 className="fw-bold mb-3 text-uppercase">3. Draft Review</h3>
                        <p className="text-muted mb-4 small">Review the initial concepts and provide feedback.</p>

                        <div className="draft-preview bg-light rounded-4 mb-4 d-flex align-items-center justify-content-center border" style={{ height: '320px', borderStyle: 'dashed' }}>
                            <div className="text-center opacity-50">
                                <svg width="48" height="48" className="mb-2"><use xlinkHref="#icon-globe" /></svg>
                                <p className="mb-0 fw-bold letter-spacing-1">INITIAL DRAFTS PENDING</p>
                                <p className="small mb-0">Mockups will appear here after consultation</p>
                            </div>
                        </div>

                        <form onSubmit={handleNext}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase">Review & Feedback</label>
                                <textarea className="form-control bg-light border-0" rows="3" placeholder="Request specific changes or revisions..." value={formData.feedback} onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}></textarea>
                            </div>
                            <div className="form-check mb-4 bg-light p-3 rounded-3 ps-5">
                                <input className="form-check-input mt-1" type="checkbox" id="approve" required checked={formData.approved} onChange={(e) => setFormData({ ...formData, approved: e.target.checked })} />
                                <label className="form-check-label small fw-bold" htmlFor="approve">
                                    I APPROVE THIS DESIGN FOR FINAL DELIVERY
                                </label>
                                <p className="text-muted small mb-0 mt-1">By checking this, you confirm the design is ready for high-res export.</p>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-outline-dark btn-lg rounded-pill px-4" onClick={() => setStep(2)}>&larr;</button>
                                <button type="submit" className="btn btn-dark btn-lg flex-grow-1 rounded-pill fw-bold">SUBMIT APPROVAL</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Step 4 Card */}
                <div className={`step-card ${step === 4 ? 'active' : ''}`}>
                    <div className="step-number">4</div>
                    <div className="step-content text-center py-2">
                        <div className="mb-4">
                            <svg width="60" height="60" className="text-success mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="fw-bold mb-2 text-uppercase">Project Complete!</h3>
                            <p className="text-muted small">Your premium design assets have been generated and are ready.</p>
                        </div>

                        <div className="delivery-grid mb-4 text-start">
                            <div className="format-card bg-light border-0">
                                <h6 className="fw-bold mb-1 small text-uppercase">Print Ready</h6>
                                <p className="small text-muted mb-0">High-Resolution PDF, AI Source, EPS</p>
                            </div>
                            <div className="format-card bg-light border-0">
                                <h6 className="fw-bold mb-1 small text-uppercase">Web Ready</h6>
                                <p className="small text-muted mb-0">Transparent PNG, JPG, SVG Vector</p>
                            </div>
                        </div>

                        <button className="btn btn-dark btn-lg w-100 rounded-pill mb-3 py-3 fw-bold shadow-sm">
                            <svg width="20" height="20" className="me-2 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            DOWNLOAD ASSETS (.ZIP)
                        </button>

                        <button type="button" className="btn btn-link text-dark text-decoration-none fw-bold small" onClick={resetForm}>
                            &larr; START ANOTHER DESIGN PROJECT
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer (Inline) */}
            <footer className="bg-white border-top py-5 px-3">
                <div className="container">
                    <div className="row g-4 mb-5">
                        <div className="col-md-5">
                            <h6 className="fw-bold mb-3 text-uppercase letter-spacing-1 h6">CustomiseMe UK</h6>
                            <p className="text-muted small pe-md-5">Premium design services and custom branding solutions for individual creators and enterprise businesses. Based in the United Kingdom.</p>
                            <div className="d-flex gap-3 mt-4">
                                <svg width="20" height="20" className="text-muted"><use xlinkHref="#icon-globe" /></svg>
                                <svg width="20" height="20" className="text-muted"><use xlinkHref="#icon-instagram" /></svg>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <h6 className="fw-bold mb-3 text-uppercase letter-spacing-1 h6">Service Links</h6>
                            <div className="row">
                                <div className="col-6">
                                    <ul className="list-unstyled small">
                                        <li className="mb-2"><Link to="/shop" className="text-decoration-none text-muted">Shop All</Link></li>
                                        <li className="mb-2"><Link to="/designstudio" className="text-decoration-none text-muted">Studio</Link></li>
                                        <li className="mb-2"><Link to="/contact" className="text-decoration-none text-muted">Contact</Link></li>
                                    </ul>
                                </div>
                                <div className="col-6">
                                    <ul className="list-unstyled small">
                                        <li className="mb-2"><Link to="/faq" className="text-decoration-none text-muted">FAQ</Link></li>
                                        <li className="mb-2"><Link to="/terms-conditions" className="text-decoration-none text-muted">Terms</Link></li>
                                        <li className="mb-2"><Link to="/privacy-policy" className="text-decoration-none text-muted">Privacy</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <h6 className="fw-bold mb-3 text-uppercase letter-spacing-1 h6">Reach Us</h6>
                            <p className="text-muted small mb-2 fw-bold">info@customisemeuk.com</p>
                            <p className="text-muted small mb-0">Hotline: 07588770901</p>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pt-4 border-top">
                        <div className="payment-icons d-flex gap-2">
                            <div className="bg-light px-2 py-1 rounded small fw-bold opacity-50">VISA</div>
                            <div className="bg-light px-2 py-1 rounded small fw-bold opacity-50">MC</div>
                            <div className="bg-light px-2 py-1 rounded small fw-bold opacity-50">AMEX</div>
                            <div className="bg-light px-2 py-1 rounded small fw-bold opacity-50">STRIPE</div>
                        </div>
                        <p className="text-muted small mb-0 opacity-50">© 2026 Customise Me UK. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DesignService;
