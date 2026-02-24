import React from 'react';
import WorkshopOptionCard from './WorkshopOptionCard';

const StepChooseExperience = ({ selectedOption, onSelect, onNext }) => {
    const options = [
        {
            id: 'design-print',
            title: 'Design & Print Workshop',
            price: '£45pp',
            description: 'A 3-hour immersive session where you design and print your own custom apparel.',
            features: ['Full design deck access', '2 Garments included', 'Expert tuition', 'Refreshments']
        },
        {
            id: 'special-event',
            title: 'Special Event Station',
            price: 'Custom',
            description: 'We bring our customisation station to your event for live printing experience.',
            features: ['Live on-site printing', 'Standard blanks included', 'Branded interface', '2 Technicians']
        }
    ];

    return (
        <div>
            <div className="row g-4 mb-4">
                {options.map(option => (
                    <WorkshopOptionCard
                        key={option.id}
                        {...option}
                        isSelected={selectedOption === option.id}
                        onSelect={onSelect}
                    />
                ))}
            </div>
            <button
                className="btn btn-primary btn-lg w-100"
                disabled={!selectedOption}
                onClick={onNext}
            >
                CONTINUE TO DETAILS
            </button>
        </div>
    );
};

export default StepChooseExperience;
