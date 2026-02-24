import React, { useState } from 'react';

const NotifyMeForm = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thanks! We'll notify ${email} when subscriptions launch.`);
        setEmail('');
    };

    return (
        <div className="mb-5">
            <h4 className="fw-bold mb-3">BE THE FIRST TO KNOW</h4>
            <p className="mx-auto mb-4 text-muted" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
                Leave your email below and we'll notify you as soon as our subscription plans are live.
                Early members will receive an exclusive welcome gift.
            </p>
            <form
                className="newsletter-form mx-auto"
                style={{
                    maxWidth: '500px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    background: '#fff',
                    padding: '4px'
                }}
                onSubmit={handleSubmit}
            >
                <input
                    type="email"
                    className="form-control border-0 shadow-none px-3"
                    placeholder="Enter your email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ background: 'transparent' }}
                />
                <button type="submit" className="btn btn-primary px-4 py-2">
                    NOTIFY ME
                </button>
            </form>
        </div>
    );
};

export default NotifyMeForm;
