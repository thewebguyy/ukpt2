import React from 'react';

const BookingProgressBar = ({ currentStep, totalSteps = 4 }) => {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="mb-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div
                className="step-progress"
                style={{
                    height: '6px',
                    backgroundColor: 'var(--color-grey-light)',
                    borderRadius: '10px',
                    overflow: 'hidden'
                }}
            >
                <div
                    className="step-progress-bar"
                    style={{
                        height: '100%',
                        width: `${progress}%`,
                        backgroundColor: 'var(--color-black)',
                        transition: 'width 0.4s ease'
                    }}
                />
            </div>
        </div>
    );
};

export default BookingProgressBar;
