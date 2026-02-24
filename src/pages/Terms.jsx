import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import LegalPageHero from '../components/legal/LegalPageHero';
import LegalPageContent from '../components/legal/LegalPageContent';
import TermsContent from '../components/legal/TermsContent';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="terms-page">
            <Helmet>
                <title>Terms & Conditions | CustomiseMe UK</title>
                <meta name="description" content="Read our terms and conditions to understand the rules and guidelines for using CustomiseMe UK's services." />
            </Helmet>

            <LegalPageHero title="TERMS & CONDITIONS" lastUpdated="February 2026" />

            <LegalPageContent>
                <TermsContent />
            </LegalPageContent>
        </div>
    );
};

export default Terms;
