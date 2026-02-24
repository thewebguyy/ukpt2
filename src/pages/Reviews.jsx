import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icons from '../components/common/Icons';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CartOffcanvas from '../components/cart/CartOffcanvas';
import ReviewsHero from '../components/reviews/ReviewsHero';
import ReviewsGrid from '../components/reviews/ReviewsGrid';
import GallerySection from '../components/reviews/GallerySection';
import ReviewsCTA from '../components/reviews/ReviewsCTA';

import { useAuthStore } from '../store/authStore';

const Reviews = () => {
    const initListener = useAuthStore(state => state.initListener);

    useEffect(() => {
        window.scrollTo(0, 0);
        const unsubscribe = initListener();
        return () => unsubscribe();
    }, [initListener]);

    return (
        <div className="reviews-page">
            <Helmet>
                <title>Customer Reviews & Gallery | CustomiseMe UK</title>
                <meta name="description" content="Read what our community says about CustomiseMe UK. Explore our gallery of custom t-shirts, hoodies, embroidery, and event setups." />
            </Helmet>

            {/* Inlined Core Layout Components as requested */}
            <Icons />
            <Header />

            <main>
                <ReviewsHero />
                <ReviewsGrid />
                <GallerySection />
                <ReviewsCTA />
            </main>

            <Footer />
            <CartOffcanvas />
        </div>
    );
};

export default Reviews;
