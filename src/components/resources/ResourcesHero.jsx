import React from 'react';

const ResourcesHero = () => {
    return (
        <section
            className="section"
            style={{
                backgroundColor: 'var(--color-grey-light)',
                padding: '5rem 0',
                textAlign: 'center'
            }}
        >
            <div className="container">
                <h1 className="display-4 fw-bold mb-3">DESIGN RESOURCES</h1>
                <p
                    className="lead opacity-75 mx-auto"
                    style={{ maxWidth: '600px', margin: '0 auto' }}
                >
                    Access our professional templates, preparation guides, and technical assets
                    to ensure your custom products are produced with perfection.
                </p>
            </div>
        </section>
    );
};

export default ResourcesHero;
