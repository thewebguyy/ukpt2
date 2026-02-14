import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { NewsletterService } from '../services/newsletter.service';
import { toast } from 'react-hot-toast';

const Subscriptions = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleWaitlist = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsSubmitting(true);
        try {
            const result = await NewsletterService.subscribe(email.trim());
            if (result.success) {
                toast.success('You\'ve been added to the waitlist!');
                setEmail('');
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="subscriptions-page">
            <Helmet>
                <title>Subscriptions - Coming Soon - CustomiseMe UK</title>
            </Helmet>

            <section className="section bg-light min-vh-75 d-flex align-items-center">
                <div className="container">
                    <div className="card border-0 shadow-lg p-5 mx-auto text-center" style={{ maxWidth: '600px' }}>
                        <div className="display-1 mb-4">
                            <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="display-4 fw-bold mb-3">COMING SOON</h1>
                        <p className="lead text-muted mb-4">
                            We're working on something exciting. Our subscription plans will offer exclusive discounts, priority access, and regular deliveries.
                        </p>

                        <form onSubmit={handleWaitlist} className="mb-4">
                            <p className="fw-bold small text-uppercase mb-2">Join the waitlist</p>
                            <div className="d-flex gap-2">
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="btn btn-dark btn-lg px-4 flex-shrink-0"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? '...' : 'NOTIFY ME'}
                                </button>
                            </div>
                            <p className="small text-muted mt-2 mb-0">We'll let you know as soon as subscriptions launch.</p>
                        </form>

                        <Link to="/shop" className="btn btn-outline-dark">
                            BROWSE THE SHOP
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Subscriptions;
