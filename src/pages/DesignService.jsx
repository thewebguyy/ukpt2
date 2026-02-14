import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const STEPS = [
    {
        number: 1,
        title: 'TELL US YOUR VISION',
        description: 'Share your design idea, brand guidelines, and any inspiration images. The more detail, the better we can bring your vision to life.',
        fields: ['description', 'inspiration']
    },
    {
        number: 2,
        title: 'CHOOSE YOUR PRODUCT',
        description: 'Select the product type and specifications for your custom design.',
        fields: ['product', 'quantity']
    },
    {
        number: 3,
        title: 'REVIEW MOCKUP',
        description: 'Our design team will create a professional mockup for your approval. Request unlimited revisions until it\'s perfect.',
        fields: []
    },
    {
        number: 4,
        title: 'APPROVE & ORDER',
        description: 'Once you\'re happy with the design, confirm your order and we\'ll begin production with our premium materials.',
        fields: []
    }
];

const DesignService = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        description: '',
        inspiration: '',
        product: 'tshirt',
        quantity: '1',
        name: '',
        email: ''
    });

    return (
        <div className="design-service-page">
            <Helmet>
                <title>Design Service - CustomiseMe UK</title>
            </Helmet>

            <section className="py-5 bg-dark text-white">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold mb-3">CUSTOM DESIGN SERVICE</h1>
                    <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
                        Work with our professional design team to create something truly unique. From concept to finished product in 4 simple steps.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {/* Step Indicators */}
                    <div className="d-flex justify-content-center mb-5">
                        {STEPS.map((step, i) => (
                            <div key={i} className="d-flex align-items-center">
                                <div
                                    className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${i <= currentStep ? 'bg-dark text-white' : 'bg-light text-muted'}`}
                                    style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                                    onClick={() => setCurrentStep(i)}
                                >
                                    {step.number}
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`mx-2 ${i < currentStep ? 'bg-dark' : 'bg-light'}`} style={{ width: '40px', height: '2px' }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Current Step Content */}
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card border-0 shadow-lg p-5 mx-auto"
                        style={{ maxWidth: '700px' }}
                    >
                        <h2 className="h3 fw-bold mb-2">STEP {STEPS[currentStep].number}: {STEPS[currentStep].title}</h2>
                        <p className="text-muted mb-4">{STEPS[currentStep].description}</p>

                        {currentStep === 0 && (
                            <div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small">DESCRIBE YOUR DESIGN</label>
                                    <textarea
                                        className="form-control form-control-lg"
                                        rows="4"
                                        placeholder="Tell us about your design idea..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small">INSPIRATION / REFERENCES</label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        placeholder="Share any links or describe reference designs..."
                                        value={formData.inspiration}
                                        onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small">PRODUCT TYPE</label>
                                    <select
                                        className="form-select form-select-lg"
                                        value={formData.product}
                                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                                    >
                                        <option value="tshirt">T-Shirt</option>
                                        <option value="hoodie">Hoodie</option>
                                        <option value="totebag">Tote Bag</option>
                                        <option value="banner">Vinyl Banner</option>
                                        <option value="sticker">Custom Stickers</option>
                                        <option value="other">Other (describe in notes)</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small">ESTIMATED QUANTITY</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-lg"
                                        min="1"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="text-center py-4">
                                <div className="bg-light p-5 rounded mb-3">
                                    <div className="spinner-border text-dark mb-3"></div>
                                    <p className="fw-bold text-muted text-uppercase small mb-0">Our design team will prepare your mockup within 24-48 hours</p>
                                </div>
                                <p className="text-muted small">You'll receive an email with your mockup for review. Unlimited revisions included.</p>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="text-center py-4">
                                <div className="mb-4">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">YOUR NAME</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">YOUR EMAIL</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <Link to="/contact?service=design" className="btn btn-dark btn-lg w-100">
                                    SUBMIT DESIGN REQUEST
                                </Link>
                            </div>
                        )}

                        <div className="d-flex justify-content-between mt-4">
                            <button
                                className="btn btn-outline-dark"
                                disabled={currentStep === 0}
                                onClick={() => setCurrentStep(s => s - 1)}
                            >
                                BACK
                            </button>
                            {currentStep < STEPS.length - 1 && (
                                <button
                                    className="btn btn-dark"
                                    onClick={() => setCurrentStep(s => s + 1)}
                                >
                                    NEXT
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default DesignService;
