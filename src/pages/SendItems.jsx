import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SendItems = () => {
    return (
        <div className="send-items-page">
            <Helmet>
                <title>Send Your Items - CustomiseMe UK</title>
            </Helmet>

            <section className="py-5 bg-dark text-white">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold mb-3">SEND YOUR ITEMS</h1>
                    <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
                        Send us your own garments, bags, or accessories and we'll customise them with your designs using professional-grade equipment.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-6">
                            <h2 className="h3 fw-bold mb-4">HOW IT WORKS</h2>
                            <div className="mb-4">
                                <div className="d-flex gap-3 mb-3">
                                    <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '36px', height: '36px' }}>1</div>
                                    <div>
                                        <h5 className="fw-bold mb-1">CONTACT US</h5>
                                        <p className="text-muted mb-0">Tell us what items you're sending and what customisation you need.</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-3 mb-3">
                                    <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '36px', height: '36px' }}>2</div>
                                    <div>
                                        <h5 className="fw-bold mb-1">SHIP TO US</h5>
                                        <p className="text-muted mb-0">Post your items to our studio. We'll inspect them and confirm suitability.</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-3 mb-3">
                                    <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '36px', height: '36px' }}>3</div>
                                    <div>
                                        <h5 className="fw-bold mb-1">WE CUSTOMISE</h5>
                                        <p className="text-muted mb-0">Our team applies your design using DTG printing, embroidery, or vinyl press.</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-3">
                                    <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '36px', height: '36px' }}>4</div>
                                    <div>
                                        <h5 className="fw-bold mb-1">SHIPPED BACK</h5>
                                        <p className="text-muted mb-0">Your customised items are quality-checked and shipped back to you.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card border-0 shadow-lg p-5">
                                <h3 className="h4 fw-bold mb-3">PRICING</h3>
                                <p className="text-muted mb-4">Pricing depends on the customisation method and complexity. Here are our starting prices:</p>
                                <ul className="list-unstyled mb-4">
                                    <li className="mb-3 d-flex justify-content-between border-bottom pb-2">
                                        <span>DTG Print (per item)</span>
                                        <span className="fw-bold">From £8.99</span>
                                    </li>
                                    <li className="mb-3 d-flex justify-content-between border-bottom pb-2">
                                        <span>Embroidery (per item)</span>
                                        <span className="fw-bold">From £12.99</span>
                                    </li>
                                    <li className="mb-3 d-flex justify-content-between border-bottom pb-2">
                                        <span>Vinyl Press (per item)</span>
                                        <span className="fw-bold">From £6.99</span>
                                    </li>
                                    <li className="d-flex justify-content-between">
                                        <span>Return Shipping</span>
                                        <span className="fw-bold">From £4.99</span>
                                    </li>
                                </ul>
                                <Link to="/contact?service=custom" className="btn btn-dark btn-lg w-100">
                                    GET A QUOTE
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SendItems;
