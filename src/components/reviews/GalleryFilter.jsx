import React from 'react';

const GalleryFilter = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { id: 'all', label: 'ALL' },
        { id: 'apparel', label: 'APPAREL' },
        { id: 'accessories', label: 'ACCESSORIES' },
        { id: 'corporate', label: 'CORPORATE' },
        { id: 'events', label: 'EVENTS' }
    ];

    return (
        <div className="text-center mb-4">
            <div className="d-flex gap-2 justify-content-center flex-wrap">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        className={`btn btn-outline ${activeFilter === filter.id ? 'active' : ''}`}
                        onClick={() => onFilterChange(filter.id)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GalleryFilter;
