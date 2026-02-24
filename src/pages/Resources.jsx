import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ResourcesHero from '../components/resources/ResourcesHero';
import ResourcesGrid from '../components/resources/ResourcesGrid';
import ResourcesCTA from '../components/resources/ResourcesCTA';

const Resources = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="resources-page">
            <Helmet>
                <title>Design Resources | CustomiseMe UK</title>
                <meta name="description" content="Download design templates, print guidelines, and visual layout assets to help you create perfect custom products." />
            </Helmet>

            <ResourcesHero />

            <ResourcesGrid />

            <ResourcesCTA />
        </div>
    );
};

export default Resources;
