import React from 'react';
import WorkshopOption from './WorkshopOption';

const WorkshopsPanel = () => {
    return (
        <div className="mt-5">
            <div className="service-card p-5" style={{ border: '2px solid var(--color-grey-light)', boxShadow: 'none' }}>
                <div className="text-center mb-5">
                    <h3 className="h2 fw-bold mb-3">CREATIVE WORKSHOPS</h3>
                    <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
                        Immerse yourself in the art of customisation with our hands-on workshops.
                        Perfect for teams, parties, or individual creative growth.
                    </p>
                </div>

                <div className="row g-4 border-top pt-4">
                    <WorkshopOption
                        title="Group Iron On Workshop"
                        description="Designed for team building and private parties. Learn the fundamentals of heat press application and material selection."
                        bullets={[
                            "Ideal for 5-15 participants",
                            "Bring your own items or use ours",
                            "Expert guidance throughout",
                            "Professional equipment provided"
                        ]}
                        ctaText="BOOK GROUP SESSION"
                        ctaLink="/contact?service=group-workshop"
                    />
                    <WorkshopOption
                        title="Individual Iron On Experience"
                        description="One-on-one session for those looking to master specific customisation techniques at their own pace."
                        bullets={[
                            "Personalised 1:1 attention",
                            "Master advanced applications",
                            "Flexible scheduling",
                            "Access to industrial machinery"
                        ]}
                        ctaText="BOOK INDIVIDUAL"
                        ctaLink="/contact?service=individual-workshop"
                    />
                </div>
            </div>
        </div>
    );
};

export default WorkshopsPanel;
