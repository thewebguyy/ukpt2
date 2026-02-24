import React from 'react';
import { Link } from 'react-router-dom';

const StepConfirmation = () => {
    return (
        <div className="text-center py-4">
            <div className="mb-4 text-success">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            </div>
            <h3 className="fw-bold mb-3">BOOKING REQUEST SENT</h3>
            <p className="text-muted mb-5 mx-auto" style={{ maxWidth: '500px' }}>
                Thank you for your interest! Our workshop coordinator will review your
                request and contact you within 24 hours to confirm availability and finalize details.
            </p>
            <div className="d-grid gap-2 col-md-6 mx-auto">
                <Link to="/" className="btn btn-primary btn-lg">RETURN TO HOMEPAGE</Link>
                <Link to="/shop" className="btn btn-outline btn-lg">CONTINUE SHOPPING</Link>
            </div>
        </div>
    );
};

export default StepConfirmation;
