import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import ProductCard from '../components/product/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroImages = ['vdaybg.png', 'shopservices.png', 'shopproducts.png'];

    const { data: featuredProducts, isLoading } = useQuery({
        queryKey: ['featuredProducts'],
        queryFn: () => ProductService.getFeaturedProducts()
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-carousel">
                    <div className="hero-slides-container">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="hero-slide active"
                            >
                                <img src={`/${heroImages[currentSlide]}`} alt={`Slide ${currentSlide + 1}`} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="hero-dots" id="hero-dots">
                        {heroImages.map((_, i) => (
                            <div
                                key={i}
                                className={`hero-dot ${currentSlide === i ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(i)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">SHOP OUR COLLECTION</h2>
                    <p className="section-subtitle">Discover premium custom designs and party essentials</p>

                    <div className="product-grid-four">
                        {isLoading ? (
                            <div className="text-center w-100 py-5">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            featuredProducts?.slice(0, 4).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        )}
                    </div>

                    <div className="text-center mt-5">
                        <Link to="/shop" className="btn btn-primary px-5">
                            <span>VIEW ALL PRODUCTS</span>
                            <svg className="icon-sm ms-2"><use xlinkHref="#icon-star" /></svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Design Studio Section */}
            <section
                className="section design-studio-section"
                style={{
                    background: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%), url('/design_studio_bg.png') no-repeat center center",
                    backgroundSize: 'cover',
                    color: 'var(--color-white)',
                    padding: 'var(--spacing-xl) 0'
                }}
            >
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-6 pe-md-5 text-start">
                            <h2 className="display-5 fw-bold mb-4">DESIGN STUDIO</h2>
                            <p className="lead mb-4" style={{ color: 'var(--color-grey-light)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                Work with our design team to create something truly unique. From concept to execution, we bring your vision
                                to life with professional-grade results.
                            </p>
                            <ul className="list-unstyled mb-4" style={{ lineHeight: 2, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                <li>• Bespoke design consultation</li>
                                <li>• Professional mockups & proofs</li>
                                <li>• Unlimited revisions</li>
                                <li>• Fast turnaround times</li>
                            </ul>
                            <Link to="/designstudio" className="btn btn-light btn-lg rounded-0 px-4 fw-bold">
                                EXPLORE STUDIO
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subscriptions */}
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title">SUBSCRIPTION PLANS</h2>
                    <p className="section-subtitle">Regular deliveries and exclusive benefits</p>

                    <div className="row g-4 justify-content-center">
                        <div className="col-md-5">
                            <div className="service-card text-center p-4 border h-100">
                                <h3 className="service-title h4 mb-3">MONTHLY ESSENTIALS</h3>
                                <p className="service-description mb-4">Curated party supplies and custom items delivered monthly</p>
                                <ul className="text-start mb-4">
                                    <li>15% discount on all orders</li>
                                    <li>Priority customer support</li>
                                    <li>Free shipping included</li>
                                    <li>Cancel anytime</li>
                                </ul>
                                <Link to="/subscriptions" className="btn btn-primary w-100">
                                    <span>SUBSCRIBE NOW</span>
                                    <svg className="icon-sm ms-2"><use xlinkHref="#icon-star" /></svg>
                                </Link>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="service-card text-center p-4 border h-100">
                                <h3 className="service-title h4 mb-3">BUSINESS PACKAGE</h3>
                                <p className="service-description mb-4">Bulk ordering and custom designs for businesses and event planners</p>
                                <ul className="text-start mb-4">
                                    <li>Dedicated account manager</li>
                                    <li>Wholesale pricing</li>
                                    <li>Custom design services</li>
                                    <li>Flexible delivery schedule</li>
                                </ul>
                                <Link to="/contact?service=business" className="btn btn-primary w-100">
                                    <span>CONTACT SALES</span>
                                    <svg className="icon-sm ms-2"><use xlinkHref="#icon-truck" /></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
