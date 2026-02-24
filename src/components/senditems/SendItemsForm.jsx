import React, { useState } from 'react';

const SendItemsForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        itemDescription: '',
        customisationDetails: '',
        quantity: '',
        targetDate: '',
        files: null,
        termsAccepted: false,
        liabilityAccepted: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add submission logic here
        alert('Thank you for your request! We will be in touch shortly.');
    };

    return (
        <div id="request-form" className="mb-5">
            <h3 className="text-center fw-bold mb-4">REQUEST A QUOTE</h3>
            <div className="p-4" style={{ background: 'var(--color-grey-light)' }}>
                <form id="send-items-form" onSubmit={handleSubmit}>
                    <div className="row g-3">
                        {/* Contact Information */}
                        <div className="col-12">
                            <h4 className="h6 fw-bold border-bottom pb-2 mb-3">CONTACT INFORMATION</h4>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">FULL NAME</label>
                            <input type="text" name="name" className="form-control" placeholder="John Doe" required onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">EMAIL ADDRESS</label>
                            <input type="email" name="email" className="form-control" placeholder="john@example.com" required onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">PHONE NUMBER</label>
                            <input type="tel" name="phone" className="form-control" placeholder="07123 456789" required onChange={handleChange} />
                        </div>

                        {/* Item Details */}
                        <div className="col-12 mt-4">
                            <h4 className="h6 fw-bold border-bottom pb-2 mb-3">ITEM DETAILS</h4>
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold">WHAT ITEMS ARE YOU SENDING?</label>
                            <textarea name="itemDescription" className="form-control" rows="3" placeholder="Describe the garments (e.g. 5 Black Hoodies, 2 Denim Jackets)" required onChange={handleChange}></textarea>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">QUANTITY</label>
                            <input type="number" name="quantity" className="form-control" placeholder="e.g. 7" required onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">TARGET DEADLINE</label>
                            <input type="date" name="targetDate" className="form-control" onChange={handleChange} />
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold">UPLOAD REFERENCE IMAGES / ARTWORK</label>
                            <input type="file" name="files" className="form-control" multiple accept="image/*" onChange={handleChange} />
                        </div>

                        {/* Additional Information */}
                        <div className="col-12 mt-4">
                            <h4 className="h6 fw-bold border-bottom pb-2 mb-3">ADDITIONAL INFORMATION</h4>
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold">CUSTOMISATION DETAILS</label>
                            <textarea name="customisationDetails" className="form-control" rows="4" placeholder="Describe your design, placement, and preferred customisation method (Print, Embroidery, etc.)" required onChange={handleChange}></textarea>
                        </div>
                        <div className="col-12">
                            <div className="form-check mb-2">
                                <input className="form-check-input" type="checkbox" name="termsAccepted" id="checkTerms" required onChange={handleChange} />
                                <label className="form-check-label small" htmlFor="checkTerms" style={{ textTransform: 'none', letterSpacing: '0' }}>
                                    I agree to the <a href="#terms" className="text-black fw-bold">Terms & Conditions</a>
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="liabilityAccepted" id="checkLiability" required onChange={handleChange} />
                                <label className="form-check-label small" htmlFor="checkLiability" style={{ textTransform: 'none', letterSpacing: '0' }}>
                                    I have read and agree to the <a href="#liability-form" className="text-black fw-bold">Liability Waiver</a>
                                </label>
                            </div>
                        </div>

                        <div className="col-12 mt-4 text-center">
                            <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">SUBMIT REQUEST</button>
                            <p className="small text-muted mb-0">
                                After submission, our team will review your request and contact you within 24 hours.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendItemsForm;
