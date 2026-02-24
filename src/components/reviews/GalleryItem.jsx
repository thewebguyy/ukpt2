import React from 'react';

const GalleryItem = ({ title, category }) => {
    return (
        <div className="gallery-item" data-category={category}>
            <div className="h-100 d-flex align-items-center justify-content-center text-muted small text-center p-3">
                {title}
            </div>
            <div className="gallery-overlay">
                <span>View Details</span>
            </div>
        </div>
    );
};

export default GalleryItem;
