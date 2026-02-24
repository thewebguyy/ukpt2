import React from 'react';
import { Link } from 'react-router-dom';

const ResourcesCTA = () => {
    return (
        <section className="section bg-black text-white py-5">
            <div className="container text-center">
                <h2 className="display-5 fw-bold mb-4 text-white">READY TO START YOUR PROJECT?</h2>
                <p className="opacity-75 mx-auto mb-5" style={{ maxWidth: '600px' }}>
                    If you need a more tailored approach, our expert design team can help
                    bring your concepts to life from scratch.
                </p>
                <Link
                    to="/designservice"
                    className="btn btn-outline-light px-5 py-3 fw-bold"
                >
                    CONTACT DESIGN SERVICE
                </Link>
            </div>
        </section>
    );
};

export default ResourcesCTA;
