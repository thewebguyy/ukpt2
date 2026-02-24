import React from 'react';
import ComingSoonHeading from './ComingSoonHeading';
import NotifyMeForm from './NotifyMeForm';
import WhatToExpectPanel from './WhatToExpectPanel';

const ComingSoonSection = () => {
    return (
        <section
            className="section"
            style={{
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--spacing-xl) 0'
            }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <ComingSoonHeading />

                        <p className="mb-5 mx-auto" style={{ maxWidth: '600px', fontSize: '1.25rem', lineHeight: '1.8' }}>
                            We're building something special for our most loyal customers. Our subscription
                            plans are designed to make customisation effortless and consistent.
                        </p>

                        <NotifyMeForm />
                        <WhatToExpectPanel />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ComingSoonSection;
