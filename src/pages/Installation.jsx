import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Installation = () => {
    return (
        <div className="installation-page">
            <Helmet>
                <title>Installation Service - CustomiseMe UK</title>
            </Helmet>

            <section className="py-5 bg-dark text-white">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold mb-3">INSTALLATION SERVICE</h1>
                    <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
                        Professional on-site installation for large format prints, vinyl banners, wall graphics, and event displays.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-6">
                            <h2 className="h3 fw-bold mb-4">WHAT WE INSTALL</h2>
                            <ul className="list-unstyled">
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <span className="fw-bold">-</span>
                                    <div><strong>Vinyl Banners</strong> - Indoor and outdoor banner installation with frames and fixings</div>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <span className="fw-bold">-</span>
                                    <div><strong>Wall Graphics</strong> - Adhesive wall wraps, murals, and branded graphics</div>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <span className="fw-bold">-</span>
                                    <div><strong>Window Graphics</strong> - Frosted vinyl, perforated vinyl, and window displays</div>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <span className="fw-bold">-</span>
                                    <div><strong>Event Displays</strong> - Pop-up stands, backdrops, and exhibition graphics</div>
                                </li>
                            </ul>
                        </div>

                        <div className="col-lg-6">
                            <div className="card border-0 shadow-lg p-5 text-center">
                                <h3 className="h4 fw-bold mb-3">REQUEST A QUOTE</h3>
                                <p className="text-muted mb-4">
                                    Tell us about your project and we'll provide a free, no-obligation quote including materials and installation.
                                </p>
                                <Link to="/contact?service=installation" className="btn btn-dark btn-lg w-100">
                                    GET A QUOTE
                                </Link>
                                <p className="small text-muted mt-3 mb-0">Serving London and surrounding areas. Nationwide available for larger projects.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Installation;
