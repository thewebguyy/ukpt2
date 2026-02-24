import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import BookingProgressBar from '../components/workshop/BookingProgressBar';
import BookingStep from '../components/workshop/BookingStep';
import StepChooseExperience from '../components/workshop/StepChooseExperience';
import StepSessionDetails from '../components/workshop/StepSessionDetails';
import StepContactInfo from '../components/workshop/StepContactInfo';
import StepConfirmation from '../components/workshop/StepConfirmation';

const Workshop = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selection, setSelection] = useState('');
    const [details, setDetails] = useState({ date: '', participants: '' });
    const [info, setInfo] = useState({ name: '', email: '', phone: '', notes: '' });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentStep]);

    const handleDetailChange = (field, value) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleInfoChange = (field, value) => {
        setInfo(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="workshop-page">
            <Helmet>
                <title>Book a Workshop | CustomiseMe UK</title>
                <meta name="description" content="Book an immersive design and print workshop or a customisation station for your next event." />
            </Helmet>

            <section className="section py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold mb-3">WORKSHOPS & EVENTS</h1>
                        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                            Experience the magic of customisation first-hand. Choose a workshop or book a live station for your event.
                        </p>
                    </div>

                    <BookingProgressBar currentStep={currentStep} />

                    <div className="mx-auto" style={{ maxWidth: '800px' }}>
                        {/* Step 1: Experience */}
                        <BookingStep
                            stepNumber="1"
                            title="CHOOSE YOUR EXPERIENCE"
                            isActive={currentStep === 1}
                            isCompleted={currentStep > 1}
                        >
                            <StepChooseExperience
                                selectedOption={selection}
                                onSelect={setSelection}
                                onNext={() => setCurrentStep(2)}
                            />
                        </BookingStep>

                        {/* Step 2: Details */}
                        <BookingStep
                            stepNumber="2"
                            title="SESSION DETAILS"
                            isActive={currentStep === 2}
                            isCompleted={currentStep > 2}
                        >
                            <StepSessionDetails
                                details={details}
                                onChange={handleDetailChange}
                                onNext={() => setCurrentStep(3)}
                            />
                        </BookingStep>

                        {/* Step 3: Contact */}
                        <BookingStep
                            stepNumber="3"
                            title="CONTACT INFORMATION"
                            isActive={currentStep === 3}
                            isCompleted={currentStep > 3}
                        >
                            <StepContactInfo
                                info={info}
                                onChange={handleInfoChange}
                                onSubmit={() => setCurrentStep(4)}
                            />
                        </BookingStep>

                        {/* Step 4: Confirmation */}
                        {currentStep === 4 && (
                            <BookingStep
                                stepNumber="4"
                                title="CONFIRMATION"
                                isActive={true}
                                isCompleted={false}
                            >
                                <StepConfirmation />
                            </BookingStep>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Workshop;
