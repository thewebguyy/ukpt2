import React from 'react';

const LegalPageHero = ({ title, lastUpdated }) => {
    return (
        <section className="section py-5" style={{ backgroundColor: 'var(--color-grey-light)' }}>
            <div className="container text-center">
                <h1 className="display-4 fw-bold">{title}</h1>
                {lastUpdated && <p className="text-muted mb-0">Last updated: {lastUpdated}</p>}
            </div>
        </section>
    );
};

export default LegalPageHero;
