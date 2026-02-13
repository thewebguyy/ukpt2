import { Helmet } from 'react-helmet-async';

const Terms = () => {
    return (
        <div className="terms-page">
            <Helmet>
                <title>Terms & Conditions - CustomiseMe UK</title>
            </Helmet>

            <section className="section bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h1 className="display-5 fw-bold mb-4">TERMS & CONDITIONS</h1>
                            <p className="text-muted mb-5">Last updated: February 2026</p>

                            <div className="bg-white p-4 rounded shadow-sm mb-4">
                                <h2 className="h4 fw-bold mb-3">1. Acceptance of Terms</h2>
                                <p className="text-grey-dark">
                                    By accessing and using CustomiseMe UK, you accept and agree to be bound by
                                    these Terms and Conditions.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded shadow-sm mb-4">
                                <h2 className="h4 fw-bold mb-3">2. Orders and Payment</h2>
                                <p className="text-grey-dark">
                                    All prices are in GBP and include VAT. Payment is processed securely through Stripe.
                                    Orders are confirmed upon successful payment.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded shadow-sm mb-4">
                                <h2 className="h4 fw-bold mb-3">3. Returns and Refunds</h2>
                                <p className="text-grey-dark">
                                    Non-customized items may be returned within 30 days. Custom/personalized items
                                    cannot be returned unless defective. Refunds processed within 5-10 business days.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded shadow-sm mb-4">
                                <h2 className="h4 fw-bold mb-3">4. Intellectual Property</h2>
                                <p className="text-grey-dark">
                                    You retain ownership of artwork you upload. By uploading, you grant us permission
                                    to use it solely for fulfilling your order.
                                </p>
                            </div>

                            <div className="alert alert-warning">
                                <p className="mb-0 small">
                                    For questions about these terms, contact us at
                                    <a href="mailto:info@customisemeuk.com" className="fw-bold"> info@customisemeuk.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Terms;
