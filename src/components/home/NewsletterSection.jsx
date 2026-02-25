import { useState } from 'react';
import { NewsletterService } from '../../services/newsletter.service';
import { toast } from 'react-hot-toast';

const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const result = await NewsletterService.subscribe(email);
            if (result.success) {
                setSubscribed(true);
                toast.success('Thank you for subscribing!');
            } else {
                toast.error(result.message || 'Subscription failed');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section bg-black text-white py-5">
            <div className="container">
                <div className="row justify-content-center text-center">
                    <div className="col-md-8 col-lg-6">
                        <h2 className="display-6 fw-bold mb-3 text-white">JOIN OUR NEWSLETTER</h2>
                        <p className="mb-4 text-grey-light">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>

                        {subscribed ? (
                            <div className="p-4 border border-success bg-dark bg-opacity-50 text-success">
                                <h4 className="mb-0">✓ YOU'RE ON THE LIST!</h4>
                                <p className="mb-0 mt-2 small text-white">Check your inbox for your 10% discount code.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="d-flex flex-column flex-md-row gap-2">
                                <input
                                    type="email"
                                    className="form-control form-control-lg rounded-0 border-0"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-light btn-lg rounded-0 px-4 fw-bold"
                                    disabled={loading}
                                >
                                    {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                                </button>
                            </form>
                        )}
                        <p className="mt-3 small text-muted">By subscribing you agree to our Terms & Privacy Policy.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
