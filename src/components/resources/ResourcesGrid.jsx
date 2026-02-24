import React from 'react';
import ResourceCard from './ResourceCard';

const ResourcesGrid = () => {
    const resourceData = [
        {
            title: "PRINT PREPARATION GUIDELINES",
            description: "Our comprehensive PDF guide on preparing your artwork for screen printing, DTG, and embroidery. Includes resolution requirements and color profiles.",
            previewContent: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            downloadHref: "/CMUK ARTWORK GUIDELINES.pdf",
            downloadFilename: "CMUK_Artwork_Guidelines.pdf",
            buttonLabel: "DOWNLOAD PDF GUIDE"
        },
        {
            title: "VISUAL LAYOUT TEMPLATE",
            description: "A high-resolution visual guide for placing your designs on different garment types. Use this to preview scale and positioning before submission.",
            previewContent: "/guidelineimage.jpeg",
            downloadHref: "/assets/layout-template.zip",
            downloadFilename: "CustomiseMeUK_Layout_Templates.zip",
            buttonLabel: "DOWNLOAD TEMPLATE PACK"
        }
    ];

    return (
        <section className="section">
            <div className="container">
                <div className="row g-4">
                    {resourceData.map((resource, index) => (
                        <ResourceCard key={index} {...resource} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ResourcesGrid;
