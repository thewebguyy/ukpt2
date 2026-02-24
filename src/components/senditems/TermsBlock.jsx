import React from 'react';

const TermsBlock = () => {
    const sections = [
        { title: "1. Item Suitability", content: "CustomiseMe reserves the right to refuse any garment or item we deem unsuitable for customisation due to fabric type, condition, or safety concerns. If refused, items will be returned at the customer's expense." },
        { title: "2. Shipping Responsibilities", content: "Customers are responsible for shipping their items to our studio. We highly recommend using a tracked and insured service. CustomiseMe is not liable for items lost in transit to us." },
        { title: "3. Customisation Risk", content: "While we use professional equipment, customising customer-provided items carries inherent risks. Some fabrics may react unexpectedly to high heat, pressure, or needle tension. By sending your items, you acknowledge these risks." },
        { title: "4. Proofing & Approval", content: "Once a quote is accepted, we will provide a digital mockup. Work will not commence until this mockup is approved via email. Changes after approval may incur additional costs." },
        { title: "5. Production Timelines", content: "Production typically takes 5-10 business days from the date of item arrival and proof approval. Express services may be available for an additional fee." },
        { title: "6. Return Shipping", content: "All completed orders are shipped back using tracked services. Return shipping costs will be calculated based on weight and volume and included in your final quote." },
        { title: "7. Payment Terms", content: "Full payment is required before production begins for orders under £500. For larger orders, a 50% deposit may be agreed upon, with the balance due before dispatch." }
    ];

    return (
        <div id="terms" className="mb-5">
            <h3 className="fw-bold mb-4 text-center">TERMS & CONDITIONS</h3>
            <div className="p-4" style={{ background: 'var(--color-grey-light)' }}>
                {sections.map((section, index) => (
                    <div key={index} className="mb-4">
                        <h5 className="h6 fw-bold mb-2">{section.title}</h5>
                        <p className="small mb-0 text-muted" style={{ textTransform: 'none', letterSpacing: '0' }}>{section.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TermsBlock;
