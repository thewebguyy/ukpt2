import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Icons from '../components/common/Icons';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CartOffcanvas from '../components/cart/CartOffcanvas';
import { useAuthStore } from '../store/authStore';

const DesignStudio = () => {
    const initListener = useAuthStore(state => state.initListener);

    useEffect(() => {
        window.scrollTo(0, 0);
        const unsubscribe = initListener();
        return () => unsubscribe();
    }, [initListener]);

    return (
        <div className="design-studio-page">
            <Helmet>
                <title>Design Studio | CustomiseMe UK</title>
                <meta name="description" content="Bring your creative visions to life with our expert design team, from concept to delivery." />
            </Helmet>

            <Icons />
            <Header />

            <main>
                {/* Hero Section */}
                <section className="ds-hero">
                    <div className="ds-hero-overlay"></div>
                    <div className="container">
                        <div className="ds-hero-content">
                            <h1>Design Service</h1>
                            <p>Bring your creative visions to life with our expert design team, from concept to delivery.</p>
                        </div>
                    </div>
                </section>

                {/* Services Grid Section */}
                <section id="services" className="ds-services-section">
                    <div className="container">
                        <div className="ds-services-grid">
                            {/* Card 1: Design Services */}
                            <div className="ds-card">
                                <div className="ds-card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l9.37-9.37a2.85 2.85 0 114.03 4.03l-9.37 9.37a4.5 4.5 0 01-1.897 1.13L4.93 22.11l1.958-4.735a4.5 4.5 0 011.13-1.897l9.37-9.37zm0 0L9 15.5m2.71-2.71L11.25 12.25" />
                                    </svg>
                                </div>
                                <h3>Design Services</h3>
                                <p>Get professional assistance from our design experts to perfect your branding and custom products.</p>
                                <ul className="ds-bullet-list">
                                    <li>Custom Logo Design</li>
                                    <li>Apparel & Merch Layouts</li>
                                    <li>High-fidelity Mockups</li>
                                    <li>Brand Guidelines Consultation</li>
                                </ul>
                                <Link to="/designservice" className="btn btn-dark w-100 mt-4">Book Design Service</Link>
                            </div>

                            {/* Card 2: Resources */}
                            <div className="ds-card">
                                <div className="ds-card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
                                    </svg>
                                </div>
                                <h3>Resources</h3>
                                <p>Access our comprehensive library of design templates, style guides, and printing specifications.</p>
                                <Link to="/resources" className="btn btn-dark w-100 mt-auto">Go to Resources</Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="ds-cta-section">
                    <div className="container text-center">
                        <h2>Ready to get started?</h2>
                        <p>Have questions about our design process? Our team is here to help you every step of the way.</p>
                        <Link to="/contact" className="btn btn-outline-white mt-4">Contact Our Team</Link>
                    </div>
                </section>
            </main>

            <Footer />
            <CartOffcanvas />
        </div>
    );
};

export default DesignStudio;
