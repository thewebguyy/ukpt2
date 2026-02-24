import React from 'react';

const LegalPageContent = ({ children }) => {
    return (
        <section className="section py-5">
            <div className="container">
                <div className="container-text">
                    {children}
                </div>
            </div>
        </section>
    );
};

export default LegalPageContent;
