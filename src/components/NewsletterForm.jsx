import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmailApiService } from '../services/emailApi.service';
import { NewsletterService } from '../services/newsletter.service';
import { toast } from 'react-hot-toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const err = {};

        if (!email.trim()) {
            err.email = 'Email is required';
        } else if (!EMAIL_REGEX.test(email.trim())) {
            err.email = 'Please enter a valid email address';
        }

        if (!firstName.trim()) {
            err.firstName = 'First name is required';
        } else if (firstName.trim().length < 2) {
            err.firstName = 'First name must be at least 2 characters';
        }

        if (!consent) {
            err.consent = 'You must agree to receive marketing emails';
        }

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!validate()) return;

        setLoading(true);
        try {
            const data = { email: email.trim().toLowerCase(), firstName: firstName.trim(), lastName: lastName.trim() };

            const result = await NewsletterService.subscribe(data);
            if (result.success) {
                setMessage({ type: 'success', text: 'Successfully subscribed to our newsletter! Check your inbox for your 10% discount code.' });
                setEmail('');
                setFirstName('');
                setLastName('');
                setConsent(false);
                toast.success('Successfully subscribed!');
            } else {
                setMessage({ type: 'error', text: result.message || 'Subscription failed.' });
            }
        } catch (err) {
            const text = err.message || 'Something went wrong. Please try again.';
            setMessage({ type: 'error', text });
            toast.error(text);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="mb-2">
                <input
                    type="email"
                    className={`form-control form-control-sm ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Your email *"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((p) => ({ ...p, email: null }));
                    }}
                    disabled={loading}
                />
                {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
            </div>
            <div className="mb-2">
                <input
                    type="text"
                    className={`form-control form-control-sm ${errors.firstName ? 'is-invalid' : ''}`}
                    placeholder="First name *"
                    value={firstName}
                    onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName) setErrors((p) => ({ ...p, firstName: null }));
                    }}
                    disabled={loading}
                />
                {errors.firstName && <div className="invalid-feedback d-block">{errors.firstName}</div>}
            </div>
            <div className="mb-2">
                <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Last name (optional)"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="mb-2">
                <label className="d-flex align-items-start gap-2 small">
                    <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                            setConsent(e.target.checked);
                            if (errors.consent) setErrors((p) => ({ ...p, consent: null }));
                        }}
                        disabled={loading}
                        className="mt-1"
                    />
                    <span>
                        I agree to receive marketing emails. Unsubscribe anytime.{' '}
                        <Link to="/privacy-policy" className="text-decoration-underline text-muted">
                            Privacy Policy
                        </Link>
                    </span>
                </label>
                {errors.consent && <div className="text-danger small">{errors.consent}</div>}
            </div>
            <button type="submit" className="btn btn-dark btn-sm w-100" disabled={loading}>
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Subscribing...
                    </>
                ) : (
                    'SUBSCRIBE'
                )}
            </button>
            {message.text && (
                <div
                    className={`mt-2 small ${message.type === 'success' ? 'text-success' : 'text-danger'}`}
                    role="alert"
                >
                    {message.text}
                </div>
            )}
        </form>
    );
}
