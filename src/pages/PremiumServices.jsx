import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PremiumServicesHero from '../components/premium-services/PremiumServicesHero';
import ServiceCardsRow from '../components/premium-services/ServiceCardsRow';
import WorkshopsPanel from '../components/premium-services/WorkshopsPanel';
import PremiumServicesCTA from '../components/premium-services/PremiumServicesCTA';

const PremiumServices = () => {
    const { hash } = useLocation();

    // Handle scroll to anchor if present (e.g. #event-setup)
    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);

    return (
        <div className="premium-services-page">
            <Helmet>
                <title>Premium Services | CustomiseMe UK</title>
                <meta name="description" content="Explore our premium services including custom event setups, corporate workshops, expert installation, and subscription plans." />
            </Helmet>

            <PremiumServicesHero />

            <section className="section">
                <div className="container">
                    {/* 4-Card Service Row */}
                    <ServiceCardsRow />

                    {/* Workshops Panel */}
                    <WorkshopsPanel />
                </div>
            </section>

            <PremiumServicesCTA />
        </div>
    );
};

export default PremiumServices;
