import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';

const SERVICE_SUBJECT_MAP = {
    business: 'Business Inquiry',
    custom: 'Custom Design Request',
    design: 'Design Service Inquiry'
};

const Contact = () => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const service = searchParams.get('service');
        if (service && SERVICE_SUBJECT_MAP[service]) {
            setFormData(prev => ({ ...prev, subject: SERVICE_SUBJECT_MAP[service] }));
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitContactFn = httpsCallable(functions, 'submitContact');
            await submitContactFn({
                name: formData.name,
                email: formData.email,
                service: formData.subject,
                message: formData.message
            });
            toast.success('Message sent! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Contact form error:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-page">
            <Helmet>
                <title>Contact Us - CustomiseMe UK</title>
            </Helmet>

            <section className="section bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold">GET IN TOUCH</h1>
                        <p className="text-grey-dark">Have a question? We'd love to hear from you.</p>
                    </div>

                    <div className="row g-5">
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm p-4 h-100">
                                <h3 className="h4 fw-bold mb-4">SEND US A MESSAGE</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">YOUR NAME</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">EMAIL ADDRESS</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">SUBJECT</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold small">MESSAGE</label>
                                        <textarea
                                            className="form-control form-control-lg"
                                            rows="5"
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-dark btn-lg w-100" disabled={isSubmitting}>
                                        {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm p-4 mb-4">
                                <h3 className="h5 fw-bold mb-3">CONTACT INFORMATION</h3>
                                <div className="mb-3">
                                    <strong>Email:</strong><br />
                                    <a href="mailto:info@customisemeuk.com">info@customisemeuk.com</a>
                                </div>
                                <div className="mb-3">
                                    <strong>Phone:</strong><br />
                                    <a href="tel:07588770901">07588770901</a>
                                </div>
                                <div>
                                    <strong>Business Hours:</strong><br />
                                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                                    Saturday: 10:00 AM - 4:00 PM<br />
                                    Sunday: Closed
                                </div>
                            </div>

                            <div className="card border-0 shadow-sm p-4">
                                <h3 className="h5 fw-bold mb-3">CUSTOM ORDERS</h3>
                                <p className="text-muted small">
                                    For bulk orders, custom designs, or business inquiries, please include
                                    "BULK ORDER" or "BUSINESS" in your subject line for priority handling.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
