import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Orders', 'Products', 'Design', 'Returns'];

    const faqs = [
        {
            category: 'Orders',
            question: "What is your delivery time?",
            answer: "Standard UK delivery takes 3-5 business days. Express delivery (1-2 days) is available at checkout. International shipping times vary by location."
        },
        {
            category: 'Orders',
            question: "How do I track my order?",
            answer: "You'll receive a tracking number via email once your order ships. You can also track orders from your account dashboard."
        },
        {
            category: 'Orders',
            question: "Can I cancel or modify my order?",
            answer: "Orders can be cancelled or modified within 2 hours of placement. After this, production begins and changes cannot be made."
        },
        {
            category: 'Products',
            question: "Do you offer free shipping?",
            answer: "Yes! We offer free UK shipping on all orders over £100. For orders under £100, standard shipping is £4.99."
        },
        {
            category: 'Products',
            question: "Do you offer bulk discounts?",
            answer: "Yes! Many of our products have tiered pricing for bulk orders. You'll see quantity discounts automatically applied on product pages."
        },
        {
            category: 'Design',
            question: "Can I upload my own design?",
            answer: "Absolutely! You can upload artwork during checkout. We accept PNG, PDF, AI, and PSD files. Minimum 300 DPI recommended."
        },
        {
            category: 'Design',
            question: "What file formats do you accept?",
            answer: "We prefer high-resolution PNG or vector files (AI, SVG, PDF). If you're using raster images, ensure they are at least 300 DPI at the desired print size."
        },
        {
            category: 'Returns',
            question: "What is your return policy?",
            answer: "We accept returns within 30 days of delivery for non-customized items. Custom/personalized items cannot be returned unless defective."
        },
        {
            category: 'Products',
            question: "What payment methods do you accept?",
            answer: "We accept all major credit/debit cards (Visa, Mastercard, Amex) via Stripe's secure payment platform."
        }
    ];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <Helmet>
                <title>Help Center & FAQ - CustomiseMe UK</title>
                <meta name="description" content="Find answers to common questions about orders, products, design services, and returns." />
            </Helmet>

            {/* Page Header Section */}
            <section className="py-5 bg-light text-center">
                <div className="container">
                    <h1 className="display-4 fw-bold mb-3">HELP CENTER</h1>
                    <p className="lead text-grey-dark mx-auto" style={{ maxWidth: '600px' }}>
                        Everything you need to know about our products and services.
                    </p>
                </div>
            </section>

            {/* FAQ Content Section */}
            <section className="section py-5">
                <div className="container">
                    {/* Category Filter Row */}
                    <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`btn btn-outline-dark rounded-pill px-4 ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    setOpenIndex(null); // Close open answers when filtering
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* FAQ Accordion */}
                    <div className="faq-accordion mb-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {faqs.map((faq, index) => {
                            const isVisible = activeCategory === 'All' || activeCategory === faq.category;
                            return (
                                <div
                                    key={index}
                                    className={`faq-item ${openIndex === index ? 'active' : ''} ${isVisible ? '' : 'd-none'}`}
                                    data-category={faq.category}
                                >
                                    <button
                                        className="faq-question border-0 bg-transparent"
                                        onClick={() => toggleAccordion(index)}
                                    >
                                        <span>{faq.question}</span>
                                    </button>
                                    <div className="faq-answer">
                                        <p className="py-3">{faq.answer}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Contact CTA Box */}
                    <div className="contact-cta-box text-center p-5 bg-light" style={{ padding: 'var(--spacing-lg) 0' }}>
                        <h3 className="h4 fw-bold mb-3">STILL HAVE QUESTIONS?</h3>
                        <p className="text-grey-dark mb-4 mx-auto" style={{ maxWidth: '500px' }}>
                            Our customer success team is here to help you with anything you need.
                        </p>
                        <Link to="/contact" className="btn btn-dark px-5">CONTACT US</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;

