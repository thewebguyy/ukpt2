import React from 'react';
import { Link } from 'react-router-dom';

const ReviewsCTA = () => {
    return (
        <section className="section bg-black text-white py-5">
            <div className="container text-center">
                <h2 className="display-4 fw-bold mb-4 text-white">READY TO JOIN THE COMMUNITY?</h2>
                <p className="opacity-75 mx-auto mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Experience the quality and service our customers rave about.
                    Start your custom project today.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Link
                        to="/shop"
                        className="btn btn-primary px-5 py-3"
                        style={{ backgroundColor: '#fff', color: '#000', border: 'none' }}
                    >
                        SHOP NOW
                    </Link>
                    <Link
                        to="/contact"
                        className="btn btn-outline px-5 py-3"
                        style={{ borderColor: '#fff', color: '#fff' }}
                    >
                        GET A QUOTE
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ReviewsCTA;
