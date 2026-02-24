import React from 'react';
import { Link } from 'react-router-dom';

const WorkshopOption = ({ title, description, bullets, ctaText, ctaLink }) => {
    return (
        <div className="col-md-6">
            <div className="h-100 p-4">
                <h4 className="fw-bold mb-3">{title}</h4>
                <p className="text-muted mb-4">{description}</p>

                {bullets && bullets.length > 0 && (
                    <ul className="mb-4 text-start">
                        {bullets.map((bullet, index) => (
                            <li key={index}>{bullet}</li>
                        ))}
                    </ul>
                )}

                <Link to={ctaLink} className="btn btn-outline-dark">
                    {ctaText}
                </Link>
            </div>
        </div>
    );
};

export default WorkshopOption;
