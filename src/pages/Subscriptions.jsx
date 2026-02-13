import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Subscriptions = () => {
    return (
        <div className="subscriptions-page">
            <Helmet>
                <title>Subscription Plans - CustomiseMe UK</title>
            </Helmet>

            <section className="section bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold">SUBSCRIPTION PLANS</h1>
                        <p className="text-grey-dark lead">Save more with regular deliveries and exclusive benefits</p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        <div className="col-md-5">
                            <div className="card border-0 shadow-lg p-5 h-100">
                                <div className="text-center mb-4">
                                    <h2 className="h3 fw-bold mb-3">MONTHLY ESSENTIALS</h2>
                                    <div className="display-4 fw-bold mb-2">£29<span className="h5 text-muted">/month</span></div>
                                    <p className="text-muted">Perfect for regular party planners</p>
                                </div>
                                <ul className="list-unstyled mb-4">
                                    <li className="mb-3">✓ 15% discount on all orders</li>
                                    <li className="mb-3">✓ Free UK shipping (no minimum)</li>
                                    <li className="mb-3">✓ Priority customer support</li>
                                    <li className="mb-3">✓ Early access to new products</li>
                                    <li className="mb-3">✓ Cancel anytime</li>
                                </ul>
                                <Link to="/contact?plan=monthly" className="btn btn-dark btn-lg w-100">GET STARTED</Link>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="card border-0 shadow-lg p-5 h-100 position-relative" style={{ border: '3px solid #000 !important' }}>
                                <span className="badge bg-dark position-absolute top-0 start-50 translate-middle px-4 py-2">MOST POPULAR</span>
                                <div className="text-center mb-4">
                                    <h2 className="h3 fw-bold mb-3">BUSINESS PACKAGE</h2>
                                    <div className="display-4 fw-bold mb-2">Custom<span className="h5 text-muted"> pricing</span></div>
                                    <p className="text-muted">For businesses & event planners</p>
                                </div>
                                <ul className="list-unstyled mb-4">
                                    <li className="mb-3">✓ Wholesale pricing (up to 30% off)</li>
                                    <li className="mb-3">✓ Dedicated account manager</li>
                                    <li className="mb-3">✓ Custom design services included</li>
                                    <li className="mb-3">✓ Flexible delivery schedule</li>
                                    <li className="mb-3">✓ Priority production queue</li>
                                    <li className="mb-3">✓ Net-30 payment terms available</li>
                                </ul>
                                <Link to="/contact?plan=business" className="btn btn-dark btn-lg w-100">CONTACT SALES</Link>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-5">
                        <p className="text-muted">All plans can be cancelled anytime with no cancellation fees.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Subscriptions;
