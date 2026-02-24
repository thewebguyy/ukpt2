import React from 'react';
import ProcessStep from './ProcessStep';

const ProcessStepsRow = () => {
    const steps = [
        {
            stepNumber: "01",
            title: "Request a Quote",
            description: "Fill out our form with your contact details and item information.",
            bullets: ["Item details", "Customisation needs", "Quantity"],
            ctaText: "START REQUEST",
            ctaLink: "#request-form",
            ctaType: "primary"
        },
        {
            stepNumber: "02",
            title: "Review & Confirm",
            description: "Our team reviews your request and sends you a formal quote.",
            bullets: ["Suitability check", "Price confirmation", "Timeline estimate"],
            infoNote: "Quotes are typically sent within 24 hours."
        },
        {
            stepNumber: "03",
            title: "Ship Your Items",
            description: "Package your items securely and ship them to our studio.",
            bullets: ["Secure packaging", "Tracking recommended", "Insurance options"],
            ctaText: "VIEW TERMS",
            ctaLink: "#terms",
            ctaType: "outline"
        },
        {
            stepNumber: "04",
            title: "Customise & Return",
            description: "We customise your items and ship them back to you.",
            bullets: ["Professional results", "Quality check", "Safe return shipping"],
            ctaText: "LIABILITY FORM",
            ctaLink: "#liability-form",
            ctaType: "primary"
        }
    ];

    return (
        <div className="mb-5 pb-4">
            <div className="row g-4 flex-nowrap overflow-auto">
                {steps.map((step, index) => (
                    <ProcessStep key={index} {...step} />
                ))}
            </div>
        </div>
    );
};

export default ProcessStepsRow;
