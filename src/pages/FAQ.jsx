import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What is your delivery time?",
            answer: "Standard UK delivery takes 3-5 business days. Express delivery (1-2 days) is available at checkout. International shipping times vary by location."
        },
        {
            question: "Do you offer free shipping?",
            answer: "Yes! We offer free UK shipping on all orders over £100. For orders under £100, standard shipping is £4.99."
        },
        {
            question: "Can I cancel or modify my order?",
            answer: "Orders can be cancelled or modified within 2 hours of placement. After this, production begins and changes cannot be made. Contact us immediately if you need to make changes."
        },
        {
            question: "What is your return policy?",
            answer: "We accept returns within 30 days of delivery for non-customized items in original condition. Custom/personalized items cannot be returned unless defective."
        },
        {
            question: "How do I track my order?",
            answer: "You'll receive a tracking number via email once your order ships. You can also track orders from your account dashboard."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit/debit cards (Visa, Mastercard, Amex) via Stripe's secure payment platform."
        },
        {
            question: "Can I upload my own design?",
            answer: "Absolutely! You can upload artwork during checkout. We accept PNG, PDF, AI, and PSD files. Minimum 300 DPI recommended for best quality."
        },
        {
            question: "Do you offer bulk discounts?",
            answer: "Yes! Many of our products have tiered pricing for bulk orders. You'll see quantity discounts automatically applied on product pages."
        }
    ];

    return (
        <div className="faq-page">
            <Helmet>
                <title>FAQ - CustomiseMe UK</title>
            </Helmet>

            <section className="section bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold">FREQUENTLY ASKED QUESTIONS</h1>
                        <p className="text-grey-dark">Find answers to common questions about our products and services</p>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="faq-accordion">
                                {faqs.map((faq, index) => (
                                    <div key={index} className={`faq-item ${openIndex === index ? 'active' : ''}`}>
                                        <button
                                            className="faq-question"
                                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        >
                                            {faq.question}
                                        </button>
                                        <div className="faq-answer">
                                            <p>{faq.answer}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-5 p-4 bg-white rounded shadow-sm">
                                <h3 className="h5 fw-bold mb-3">Still have questions?</h3>
                                <p className="text-muted mb-3">Can't find what you're looking for? Get in touch with our team.</p>
                                <Link to="/contact" className="btn btn-dark px-5">CONTACT US</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
