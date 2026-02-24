import React from 'react';

const ComingSoonHeading = () => {
    return (
        <div className="mb-5">
            <h2 style={{ fontSize: '3.5rem', fontWeight: 700, letterSpacing: '0.1em' }} className="mb-0">
                COMING SOON
            </h2>
            <div
                style={{
                    width: '100px',
                    height: '4px',
                    backgroundColor: 'var(--color-black)',
                    margin: '2rem auto'
                }}
            />
        </div>
    );
};

export default ComingSoonHeading;
