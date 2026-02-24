import React from 'react';
import { Link } from 'react-router-dom';

const ProcessStep = ({ stepNumber, title, description, bullets, ctaText, ctaLink, ctaType = 'primary', infoNote }) => {
    const isAnchor = ctaLink && ctaLink.startsWith('#');

    return (
        <div className="col-lg-3 col-md-3 col-sm-3 col-3">
            <div className="service-card p-5 h-100 d-flex flex-column border">
                <div className="fw-bold mb-3" style={{ fontSize: '2.5rem', lineHeight: 1 }}>{stepNumber}</div>
                <h3 className="h5 fw-bold mb-3">{title}</h3>
                <p className="text-muted mb-3 flex-grow-1" style={{ fontSize: '0.9rem' }}>{description}</p>
                {bullets && (
                    <ul className="list-unstyled mb-4" style={{ fontSize: '0.85rem' }}>
                        {bullets.map((bullet, index) => (
                            <li key={index} className="mb-2 d-flex align-items-start gap-2">
                                <span style={{ color: 'var(--color-black)' }}>•</span>
                                <span>{bullet}</span>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-auto">
                    {ctaText && (
                        isAnchor ? (
                            <a href={ctaLink} className={`btn btn-${ctaType} w-100`}>
                                {ctaText}
                            </a>
                        ) : (
                            <Link to={ctaLink} className={`btn btn-${ctaType} w-100`}>
                                {ctaText}
                            </Link>
                        )
                    )}
                    {infoNote && (
                        <p className="small text-muted mb-0 mt-3" style={{ fontStyle: 'italic' }}>{infoNote}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProcessStep;
