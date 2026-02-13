import { Helmet } from 'react-helmet-async';

const Privacy = () => {
    return (
        <div className="privacy-page">
            <Helmet>
                <title>Privacy Policy - CustomiseMe UK</title>
            </Helmet>

            <section className="section bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h1 className="display-5 fw-bold mb-4">PRIVACY POLICY</h1>
                            <p className="text-muted mb-5">Last updated: February 2026</p>

                            <div className="bg-white p-4 rounded shadow-sm mb-4">
                                <h2 className="h4 fw-bold mb-3">1. Information We Collect</h2>
                                <p className="text-grey-dark">
                                    We collect information you provide directly to us, including name, email address,
                                    shipping address, and payment information when you create an account or place an order.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded shadow-sm mb-4">
                                <h2 className="h4 fw-bold mb-3">2. How We Use Your Information</h2>
                                <p className="text-grey-dark">
                                    We use the information we collect to process orders, communicate with you,
                                    improve our services, and comply with legal obligations.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded shadow-sm mb-4">
                                <h2 className="h4 fw-bold mb-3">3. Data Security</h2>
                                <p className="text-grey-dark">
                                    We implement appropriate security measures to protect your personal information.
                                    Payment processing is handled securely through Stripe.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded shadow-sm mb-4">
                                <h2 className="h4 fw-bold mb-3">4. Your Rights</h2>
                                <p className="text-grey-dark">
                                    You have the right to access, correct, or delete your personal information.
                                    Contact us at info@customisemeuk.com for data requests.
                                </p>
                            </div>

                            <div className="alert alert-info">
                                <p className="mb-0 small">
                                    For questions about this privacy policy, contact us at
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

export default Privacy;
