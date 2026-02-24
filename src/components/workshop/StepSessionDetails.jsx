import React from 'react';

const StepSessionDetails = ({ details, onChange, onNext }) => {
    return (
        <div>
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <label className="form-label small fw-bold">PREFERRED DATE</label>
                    <input
                        type="date"
                        className="form-control"
                        value={details.date}
                        onChange={(e) => onChange('date', e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label small fw-bold">NUMBER OF PARTICIPANTS</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Min 5 people"
                        value={details.participants}
                        onChange={(e) => onChange('participants', e.target.value)}
                        required
                    />
                </div>
                <div className="col-12 mt-3">
                    <p className="small text-muted mb-0">
                        * Final date availability will be confirmed by our team within 24 hours of your request.
                    </p>
                </div>
            </div>
            <button
                className="btn btn-primary btn-lg w-100"
                onClick={onNext}
                disabled={!details.date || !details.participants}
            >
                CONTINUE TO CONTACT
            </button>
        </div>
    );
};

export default StepSessionDetails;
