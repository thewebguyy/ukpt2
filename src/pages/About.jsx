import { Helmet } from 'react-helmet-async';

const About = () => {
    return (
        <div className="about-page">
            <Helmet>
                <title>About Us - CustomiseMe UK</title>
            </Helmet>

            <section className="section bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold">ABOUT CUSTOMISEME UK</h1>
                        <p className="text-grey-dark lead">Premium custom printing and design services</p>
                    </div>

                    <div className="row g-5 align-items-center mb-5">
                        <div className="col-lg-6">
                            <h2 className="h3 fw-bold mb-4">OUR STORY</h2>
                            <p className="text-grey-dark mb-3">
                                CustomiseMe UK was founded with a simple mission: to make professional-quality
                                custom printing accessible to everyone. Whether you're planning a party, launching
                                a business, or creating memorable gifts, we're here to bring your vision to life.
                            </p>
                            <p className="text-grey-dark mb-3">
                                Based in the UK, we combine cutting-edge printing technology with exceptional
                                customer service to deliver products that exceed expectations. From small personal
                                orders to large commercial projects, we treat every customer with the same dedication
                                and attention to detail.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="bg-grey-light p-5 rounded">
                                <div className="text-center">
                                    <div className="display-1 mb-3">🎨</div>
                                    <h3 className="h4 fw-bold">QUALITY & CREATIVITY</h3>
                                    <p className="text-muted">Our core values</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 text-center mb-5">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm p-4 h-100">
                                <div className="h1 mb-3">⚡</div>
                                <h3 className="h5 fw-bold mb-3">FAST TURNAROUND</h3>
                                <p className="text-muted small mb-0">Most orders ship within 3-5 business days</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm p-4 h-100">
                                <div className="h1 mb-3">✓</div>
                                <h3 className="h5 fw-bold mb-3">QUALITY GUARANTEE</h3>
                                <p className="text-muted small mb-0">Premium materials and professional printing</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm p-4 h-100">
                                <div className="h1 mb-3">💬</div>
                                <h3 className="h5 fw-bold mb-3">EXPERT SUPPORT</h3>
                                <p className="text-muted small mb-0">Dedicated team ready to help with your project</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center bg-dark text-white p-5 rounded">
                        <h2 className="h3 fw-bold mb-3">READY TO START YOUR PROJECT?</h2>
                        <p className="mb-4">Browse our products or get in touch to discuss custom solutions</p>
                        <div className="d-flex gap-3 justify-content-center flex-wrap">
                            <a href="/shop" className="btn btn-light btn-lg px-5">BROWSE PRODUCTS</a>
                            <a href="/contact" className="btn btn-outline-light btn-lg px-5">CONTACT US</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
