import React from 'react';

const ReviewCard = ({ stars, text, author }) => {
    return (
        <div className="col-md-4">
            <div className="review-card">
                <div className="review-stars mb-3">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < stars ? 'var(--color-black)' : 'var(--color-grey-light)' }}>★</span>
                    ))}
                </div>
                <p className="review-text">"{text}"</p>
                <div className="review-author mt-auto">{author}</div>
            </div>
        </div>
    );
};

export default ReviewCard;
