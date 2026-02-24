import React, { useState } from 'react';

const StepContactInfo = ({ info, onChange, onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
                <div className="col-12">
                    <label className="form-label small fw-bold">FULL NAME</label>
                    <input
                        type="text"
                        className="form-control"
                        required
                        value={info.name}
                        onChange={(e) => onChange('name', e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label small fw-bold">EMAIL ADDRESS</label>
                    <input
                        type="email"
                        className="form-control"
                        required
                        value={info.email}
                        onChange={(e) => onChange('email', e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label small fw-bold">PHONE NUMBER</label>
                    <input
                        type="tel"
                        className="form-control"
                        required
                        value={info.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
                    />
                </div>
                <div className="col-12">
                    <label className="form-label small fw-bold">ADDITIONAL NOTES</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Tell us about any specific requirements or event details..."
                        value={info.notes}
                        onChange={(e) => onChange('notes', e.target.value)}
                    ></textarea>
                </div>
            </div>
            <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        SENDING REQUEST...
                    </>
                ) : (
                    'BOOK WORKSHOP'
                )}
            </button>
        </form>
    );
};

export default StepContactInfo;
