import React from 'react';
import { Link } from 'react-router-dom';

const PremiumServicesCTA = () => {
    return (
        <section className="section bg-black text-white py-5 mt-5">
            <div className="container text-center">
                <h2 className="display-5 fw-bold mb-4 text-white">READY TO ELEVATE YOUR BRAND?</h2>
                <p className="opacity-75 mx-auto mb-5" style={{ maxWidth: '600px' }}>
                    Our premium services are tailored to meet the unique needs of brands,
                    creatives, and event planners looking for excellence.
                </p>
                <Link
                    to="/contact"
                    className="btn btn-primary px-5"
                    style={{ background: '#fff', color: '#000', border: 'none' }}
                >
                    CONTACT OUR EXPERTS
                </Link>
            </div>
        </section>
    );
};

export default PremiumServicesCTA;
