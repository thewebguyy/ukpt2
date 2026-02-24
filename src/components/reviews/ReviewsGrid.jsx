import React from 'react';
import ReviewCard from './ReviewCard';

const ReviewsGrid = () => {
    const reviews = [
        {
            stars: 5,
            text: "Absolutely stunning quality! The embroidery on the hoodies was perfect and the turn-around time was much faster than expected.",
            author: "Sarah J."
        },
        {
            stars: 5,
            text: "Fast shipping and the design studio was so easy to use. My custom t-shirts look exactly like the preview. Highly recommend!",
            author: "Mark T."
        },
        {
            stars: 5,
            text: "Best custom printing service I've used. The team was extremely helpful when I had questions about my artwork preparation.",
            author: "Emma W."
        },
        {
            stars: 4,
            text: "Great experience overall. The t-shirt quality is solid and the print has held up perfectly after multiple washes.",
            author: "David L."
        },
        {
            stars: 5,
            text: "Ordered custom tote bags for my small business. They arrived beautifully packaged and the print quality is top-notch.",
            author: "Chloe R."
        },
        {
            stars: 5,
            text: "Exceptional service! They went above and beyond to make sure my event banners were perfect for the launch day.",
            author: "James M."
        }
    ];

    return (
        <section className="section">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title">WHAT OUR CLIENTS SAY</h2>
                    <p className="section-subtitle">Real feedback from real customers about our quality and service.</p>
                </div>
                <div className="row g-4">
                    {reviews.map((review, index) => (
                        <ReviewCard key={index} {...review} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewsGrid;
