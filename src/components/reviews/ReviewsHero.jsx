import React from 'react';

const ReviewsHero = () => {
    return (
        <section className="section py-5" style={{ backgroundColor: 'var(--color-grey-light)' }}>
            <div className="container text-center">
                <h1 className="display-4 fw-bold mb-3">CUSTOMER REVIEWS</h1>
                <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    See what our community has to say about their CustomiseMe experience.
                    From quality prints to exceptional service, we let our work speak for itself.
                </p>
            </div>
        </section>
    );
};

export default ReviewsHero;
