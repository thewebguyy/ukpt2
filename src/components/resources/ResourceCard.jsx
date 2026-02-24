import React from 'react';
import './ResourceCard.css';

const ResourceCard = ({ title, description, previewContent, downloadHref, downloadFilename, buttonLabel }) => {
    return (
        <div className="col-md-6">
            <div className="resource-card">
                <div className="resource-preview">
                    {typeof previewContent === 'string' ? (
                        <img src={previewContent} alt={title} />
                    ) : (
                        previewContent
                    )}
                </div>
                <div className="card-body">
                    <h2 className="resource-title">{title}</h2>
                    <p className="resource-description">{description}</p>
                    <a
                        href={downloadHref}
                        download={downloadFilename}
                        className="download-btn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {buttonLabel}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
