import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PrivacyPolicyHero from '../components/privacy/PrivacyPolicyHero';
import PrivacyPolicyContent from '../components/privacy/PrivacyPolicyContent';

const Privacy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="privacy-page">
            <Helmet>
                <title>Privacy Policy | CustomiseMe UK</title>
                <meta name="description" content="Read our privacy policy to understand how CustomiseMe UK collects, uses, and protects your personal data." />
            </Helmet>

            <PrivacyPolicyHero />

            <PrivacyPolicyContent />
        </div>
    );
};

export default Privacy;
