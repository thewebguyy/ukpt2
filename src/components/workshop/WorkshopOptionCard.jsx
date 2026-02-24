import React from 'react';

const WorkshopOptionCard = ({ id, title, description, price, features, isSelected, onSelect }) => {
    return (
        <div className="col-md-6">
            <div
                className={`workshop-option h-100 p-4 border rounded-3 cursor-pointer`}
                style={{
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--color-black)' : 'var(--color-grey-light)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    backgroundColor: isSelected ? 'rgba(0,0,0,0.02)' : 'white',
                    transition: 'all 0.2s ease'
                }}
                onClick={() => onSelect(id)}
            >
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h4 className="h5 fw-bold mb-0">{title}</h4>
                    <div
                        className="fw-bold"
                        style={{ color: '#ff4d4d', fontSize: '1.25rem' }}
                    >
                        {price}
                    </div>
                </div>
                <p className="small text-muted mb-3" style={{ textTransform: 'none', letterSpacing: '0' }}>{description}</p>
                <ul className="list-unstyled mb-0" style={{ fontSize: '0.85rem' }}>
                    {features.map((feature, index) => (
                        <li key={index} className="mb-2 d-flex gap-2">
                            <span>•</span>
                            <span style={{ textTransform: 'none', letterSpacing: '0' }}>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WorkshopOptionCard;
