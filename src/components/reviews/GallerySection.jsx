import React, { useState } from 'react';
import GalleryFilter from './GalleryFilter';
import GalleryItem from './GalleryItem';

const GallerySection = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const galleryItems = [
        { title: "Custom Embroidered Hoodie - Team Setup", category: "apparel" },
        { title: "Corporate Gift Pack - Logo Embroidery", category: "corporate" },
        { title: "Event Tote Bags - Live Screen Printing", category: "events" },
        { title: "Vinyl Decals - Studio Window Setup", category: "corporate" },
        { title: "Custom Cap - Individual Embroidery", category: "accessories" },
        { title: "Staff Uniforms - Full Branding Pack", category: "corporate" },
        { title: "Personalised Backpack - Vinyl Press", category: "accessories" },
        { title: "Festival T-Shirts - Bulk Screen Print", category: "events" },
        { title: "Premium Sweatshirt - High Density Print", category: "apparel" }
    ];

    const filteredItems = activeFilter === 'all'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeFilter);

    return (
        <section className="section" style={{ backgroundColor: 'var(--color-grey-light)' }}>
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title">PROJECT GALLERY</h2>
                    <p className="section-subtitle">A look at some of our recent customisation projects and event setups.</p>
                </div>

                <GalleryFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />

                <div className="gallery-grid">
                    {filteredItems.map((item, index) => (
                        <GalleryItem key={index} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
