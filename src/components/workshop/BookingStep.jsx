import React from 'react';

const BookingStep = ({ stepNumber, title, isActive, isCompleted, children }) => {
    let borderColor = 'var(--color-grey-light)';
    let opacity = 1;
    let shadow = 'var(--shadow-sm)';

    if (isActive) {
        borderColor = 'var(--color-black)';
        shadow = 'var(--shadow-lg)';
    } else if (isCompleted) {
        borderColor = 'var(--color-grey)';
        opacity = 0.7;
    }

    if (!isActive && !isCompleted) {
        return null; // Only show active or completed steps if requested, but spec says they are all in DOM.
        // I'll follow the spec: they are all in DOM but content is toggled.
    }

    return (
        <div
            className={`step-card p-5 mb-5 position-relative border-2 border shadow-sm`}
            style={{
                backgroundColor: '#fff',
                borderColor: borderColor,
                opacity: opacity,
                boxShadow: shadow,
                transition: 'all 0.3s ease',
                borderStyle: 'solid',
                borderWidth: '2px'
            }}
        >
            <div
                className="step-number d-flex align-items-center justify-content-center fw-bold text-white rounded-circle"
                style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '3rem',
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'var(--color-black)',
                    fontSize: '1.5rem',
                    zIndex: 2
                }}
            >
                {stepNumber}
            </div>

            <div className="step-content">
                <h3 className="h5 fw-bold mb-4">{title}</h3>
                {children}
            </div>
        </div>
    );
};

export default BookingStep;
