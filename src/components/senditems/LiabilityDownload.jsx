import React from 'react';

const LiabilityDownload = () => {
    return (
        <div id="liability-form" className="mb-5">
            <h3 className="fw-bold mb-4 text-center">LIABILITY WAIVER</h3>
            <div className="p-5 text-center" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)' }}>
                <h4 className="fw-bold mb-3" style={{ color: 'var(--color-white)' }}>DOWNLOAD LIABILITY FORM</h4>
                <p className="mb-4 opacity-75 mx-auto" style={{ maxWidth: '600px', textTransform: 'none', letterSpacing: '0' }}>
                    For all "Send Your Own" orders, we require a signed liability waiver to be included in your package.
                    This ensures you understand the risks involved in customising high-value or sentimental items.
                </p>
                <a
                    href="/files/customiseme_liability_waiver.pdf"
                    className="btn btn-light btn-lg px-5 fw-bold"
                    style={{ backgroundColor: 'white', color: 'black', border: 'none' }}
                    download
                >
                    DOWNLOAD PDF
                </a>
                <p className="mt-4 small opacity-50 mb-0" style={{ textTransform: 'none', letterSpacing: '0' }}>
                    * If you cannot print this form, please contact our support team for a digital signature link.
                </p>
            </div>
        </div>
    );
};

export default LiabilityDownload;
