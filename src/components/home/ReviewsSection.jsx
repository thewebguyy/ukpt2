import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import ReviewCard from '../reviews/ReviewCard';

const ReviewsSection = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const placeholderReviews = [
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
        }
    ];

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Try to fetch global reviews if they exist, otherwise use placeholders
                const reviewsRef = collection(db, 'reviews');
                const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(3));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const fetchedReviews = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setReviews(fetchedReviews);
                } else {
                    setReviews(placeholderReviews);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setReviews(placeholderReviews);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    return (
        <section className="section bg-light">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title">WHAT OUR CLIENTS SAY</h2>
                    <p className="section-subtitle">Real feedback from our satisfied customers</p>
                </div>

                <div className="row g-4 justify-content-center">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="col-md-4">
                                <div className="skeleton-card p-4 bg-white" style={{ height: '200px' }}></div>
                            </div>
                        ))
                    ) : (
                        reviews.map((review, index) => (
                            <div key={index} className="col-md-4">
                                <ReviewCard {...review} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
