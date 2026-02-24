import React from 'react';
import { Link } from 'react-router-dom';

const WhatToExpectPanel = () => {
    return (
        <div className="mx-auto" style={{ maxWidth: '800px' }}>
            <div className="p-5" style={{ backgroundColor: 'var(--color-grey-light)' }}>
                <h5 className="fw-bold mb-4">WHAT TO EXPECT</h5>
                <div className="row g-3 text-start">
                    <div className="col-md-6">
                        <p className="mb-3 d-flex gap-2" style={{ textTransform: 'none', letterSpacing: '0' }}>
                            <strong style={{ color: 'var(--color-black)' }}>✓</strong>
                            Monthly curated custom items delivered to your door.
                        </p>
                        <p className="mb-3 d-flex gap-2" style={{ textTransform: 'none', letterSpacing: '0' }}>
                            <strong style={{ color: 'var(--color-black)' }}>✓</strong>
                            Exclusive "members-only" designs and colorways.
                        </p>
                        <p className="mb-0 d-flex gap-2" style={{ textTransform: 'none', letterSpacing: '0' }}>
                            <strong style={{ color: 'var(--color-black)' }}>✓</strong>
                            15% discount on all additional shop orders.
                        </p>
                    </div>
                    <div className="col-md-6">
                        <p className="mb-3 d-flex gap-2" style={{ textTransform: 'none', letterSpacing: '0' }}>
                            <strong style={{ color: 'var(--color-black)' }}>✓</strong>
                            Free shipping on every subscription box.
                        </p>
                        <p className="mb-3 d-flex gap-2" style={{ textTransform: 'none', letterSpacing: '0' }}>
                            <strong style={{ color: 'var(--color-black)' }}>✓</strong>
                            Priority booking for workshops and setups.
                        </p>
                        <p className="mb-0 d-flex gap-2" style={{ textTransform: 'none', letterSpacing: '0' }}>
                            <strong style={{ color: 'var(--color-black)' }}>✓</strong>
                            Early access to new product drops.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <p className="text-muted mb-4">
                    Interested in a custom business subscription for your team?
                </p>
                <Link to="/contact?service=subscribe-monthly" className="btn btn-outline px-5">
                    CONTACT SALES
                </Link>
            </div>
        </div>
    );
};

export default WhatToExpectPanel;
