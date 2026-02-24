import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ id, title, description, bullets, ctaText, ctaLink }) => {
    return (
        <div className="col-lg-3 col-md-3 col-sm-3 col-3" id={id}>
            <div className="service-card h-100 p-5 d-flex flex-column">
                <h3 className="service-title">{title}</h3>
                <p className="service-description flex-grow-1">{description}</p>

                {bullets && bullets.length > 0 && (
                    <ul className="mb-4">
                        {bullets.map((bullet, index) => (
                            <li key={index}>{bullet}</li>
                        ))}
                    </ul>
                )}

                <div className="mt-auto">
                    <Link to={ctaLink} className="btn btn-primary w-100">
                        {ctaText}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
