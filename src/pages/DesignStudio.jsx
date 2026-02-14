import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const DesignStudio = () => {
    const containerRef = useRef(null);

    return (
        <div className="design-studio-page">
            <Helmet>
                <title>3D Design Studio - CustomiseMe UK</title>
            </Helmet>

            <section className="hero-section bg-dark text-white py-5">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold mb-3 text-uppercase">3D DESIGN STUDIO</h1>
                    <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
                        Bring your creative vision to life in full 3D. Customize materials, colors, and generate high-fidelity mockups instantly.
                    </p>
                </div>
            </section>

            <div className="container-fluid p-0 bg-light vh-75 position-relative studio-container">
                <div className="row g-0 h-100">
                    {/* Sidebar Controls */}
                    <div className="col-lg-auto h-100 bg-white shadow-lg p-4 studio-sidebar" style={{ width: '320px', zIndex: 10 }}>
                        <h5 className="fw-bold mb-4 border-bottom pb-2">CONFIGURATION</h5>

                        <div className="config-group mb-4">
                            <label className="small fw-bold text-uppercase mb-2 d-block">Select Base Model</label>
                            <select className="form-select border-0 bg-light">
                                <option value="tshirt">Heavyweight T-Shirt</option>
                                <option value="hoodie">Premium Hoodie (Coming Soon)</option>
                                <option value="tote">Canvas Tote Bag (Coming Soon)</option>
                            </select>
                        </div>

                        <div className="config-group mb-4">
                            <label className="small fw-bold text-uppercase mb-2 d-block">Fabric Color</label>
                            <div className="d-flex gap-2 flex-wrap">
                                {['#000000', '#ffffff', '#000080', '#e63946', '#6b7280', '#059669'].map(c => (
                                    <button key={c} className="rounded-circle border-0 shadow-sm" style={{ width: '30px', height: '30px', backgroundColor: c }}></button>
                                ))}
                            </div>
                        </div>

                        <div className="config-group mb-4">
                            <label className="small fw-bold text-uppercase mb-2 d-block">Overlay Artwork</label>
                            <button className="btn btn-outline-dark btn-sm w-100 py-3 d-flex align-items-center justify-content-center gap-2">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                Upload PNG
                            </button>
                        </div>

                        <div className="mt-4 pt-4 border-top">
                            <button className="btn btn-dark w-100 py-3 fw-bold rounded-0">ADD TO CART</button>
                            <p className="small text-muted text-center mt-2 mb-0">Rendering via CustomiseMe 3D Engine v2.1</p>
                        </div>
                    </div>

                    {/* 3D Viewport Placeholder */}
                    <div
                        ref={containerRef}
                        className="col studio-viewport d-flex align-items-center justify-content-center bg-gray-200"
                        style={{ minHeight: '500px' }}
                    >
                        <div className="text-center">
                            <div className="spinner-border text-dark mb-3"></div>
                            <p className="fw-bold text-muted text-uppercase small">Initializing 3D Environment...</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="section py-5 bg-white">
                <div className="container">
                    <div className="row g-4 text-center">
                        <div className="col-md-4">
                            <div className="h1 mb-3">⚡</div>
                            <h5 className="fw-bold">REAL-TIME PREVIEW</h5>
                            <p className="text-muted small">See every detail of your design from every angle with our physical-based rendering.</p>
                        </div>
                        <div className="col-md-4">
                            <div className="h1 mb-3">🎨</div>
                            <h5 className="fw-bold">HIGH DEFINITION</h5>
                            <p className="text-muted small">Export 4K mockups of your customized products for social media and branding.</p>
                        </div>
                        <div className="col-md-4">
                            <div className="h1 mb-3">🛠️</div>
                            <h5 className="fw-bold">BESPOKE QUALITY</h5>
                            <p className="text-muted small">What you see is what you get. Every 3D model is calibrated to our production equipment.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section py-5 bg-light">
                <div className="container text-center">
                    <h3 className="h4 fw-bold mb-3">NEED EXPERT HELP?</h3>
                    <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '500px' }}>
                        Our design team can bring your vision to life. Book a consultation or explore our resource library.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Link to="/designservice" className="btn btn-dark btn-lg fw-bold px-4">Book Consultation</Link>
                        <Link to="/resources" className="btn btn-outline-dark btn-lg fw-bold px-4">Check Out Resources</Link>
                    </div>
                    <div className="mt-4">
                        <Link to="/contact?service=design" className="text-dark fw-bold">Have questions? Contact our design team &rarr;</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DesignStudio;
