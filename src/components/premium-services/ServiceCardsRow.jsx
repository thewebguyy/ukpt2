import React from 'react';
import ServiceCard from './ServiceCard';

const ServiceCardsRow = () => {
    const services = [
        {
            id: "send-items",
            title: "Send Your Items",
            description: "Send us your own garments and products and we will customise them for you with the highest quality materials.",
            bullets: ["Quality checking", "Professional printing", "Fast turnaround"],
            ctaText: "GET STARTED",
            ctaLink: "/senditems"
        },
        {
            id: "subscriptions",
            title: "Subscriptions",
            description: "Join our exclusive subscription programs for recurring customisation needs and priority service benefits.",
            bullets: ["Monthly credits", "exclusive designs", "priority support"],
            ctaText: "VIEW PLANS",
            ctaLink: "/subscriptions"
        },
        {
            id: "installation",
            title: "Expert Installation",
            description: "Professional on-site installation for your custom vinyls, signage, and large-scale branding projects.",
            bullets: ["UK-wide coverage", "Certified team", "Full insurance"],
            ctaText: "LEARN MORE",
            ctaLink: "/installation"
        },
        {
            id: "event-setup",
            title: "Event Setup",
            description: "Bespoke on-site customisation booths and decor setups for your next big event or corporate gathering.",
            bullets: ["Live printing", "Interactive booths", "Custom branding"],
            ctaText: "INQUIRE NOW",
            ctaLink: "/contact?service=event-setup"
        }
    ];

    return (
        <div className="row g-4 flex-nowrap overflow-auto pb-4">
            {services.map((service) => (
                <ServiceCard key={service.id} {...service} />
            ))}
        </div>
    );
};

export default ServiceCardsRow;
