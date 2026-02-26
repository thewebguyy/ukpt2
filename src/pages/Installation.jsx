import { Helmet } from 'react-helmet-async';

const Installation = () => {
    return (
        <div className="installation-page">
            <Helmet>
                <title>Installation Services - CustomiseMe UK</title>
                <meta name="description" content="Professional on-site installation services for window vinyls, wall graphics, and event backdrops." />
            </Helmet>

            {/* Page Header Section */}
            <section className="py-5 bg-light text-center">
                <div className="container">
                    <h1 className="display-4 fw-bold mb-3">PROFESSIONAL INSTALLATION</h1>
                    <p className="lead text-grey-dark mx-auto" style={{ maxWidth: '700px' }}>
                        Transforming spaces with precision and professional care. We bring your vision to life on-site.
                    </p>
                </div>
            </section>

            {/* Installation Content Section */}
            <section className="section py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12">

                            {/* Block 1: Introduction */}
                            <div className="mb-5 text-center">
                                <h2 className="fw-bold mb-4">Precision On-Site Service</h2>
                                <p className="text-grey-dark mx-auto" style={{ maxWidth: '800px' }}>
                                    At CustomiseMe UK, we don't just print your graphics—we ensure they are installed to the highest professional standards. Our experienced installation team handles everything from delicate window films to large-scale wall murals and event displays, ensuring a perfect finish every time.
                                </p>
                            </div>

                            {/* Block 2: Our Installation Services */}
                            <div className="installation-services mb-5 pb-5">
                                <h3 className="text-center fw-bold mb-5">Our Installation Services</h3>
                                <div className="row">
                                    {/* Service 1: Window Vinyls */}
                                    <div className="col-lg-4 col-md-6 col-12 mb-4">
                                        <div className="service-tile bg-white border shadow-sm p-4 h-100">
                                            <div className="mb-4" style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                                                <img
                                                    src="/window vinyl image.png"
                                                    alt="Window Vinyl Installation"
                                                    className="w-100 h-100"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <svg className="icon-sm text-dark"><use xlinkHref="#icon-star" /></svg>
                                                <h4 className="h5 fw-bold mb-0">Window Vinyls</h4>
                                            </div>
                                            <ul className="list-unstyled text-grey-dark small">
                                                <li className="mb-2">• Frosted privacy films</li>
                                                <li className="mb-2">• Full-color retail graphics</li>
                                                <li className="mb-2">• Perforated one-way vision</li>
                                                <li>• Seasonal promotion decals</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Service 2: Wall Vinyls */}
                                    <div className="col-lg-4 col-md-6 col-12 mb-4">
                                        <div className="service-tile bg-white border shadow-sm p-4 h-100">
                                            <div className="mb-4 d-flex align-items-center justify-content-center bg-grey-light" style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                                                <span className="text-grey small fw-bold">WALL VINYL IMAGE</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <svg className="icon-sm text-dark"><use xlinkHref="#icon-package" /></svg>
                                                <h4 className="h5 fw-bold mb-0">Wall Vinyls</h4>
                                            </div>
                                            <ul className="list-unstyled text-grey-dark small">
                                                <li className="mb-2">• Custom branded murals</li>
                                                <li className="mb-2">• Office wayfinding graphics</li>
                                                <li className="mb-2">• Textured surface vinyls</li>
                                                <li>• Removable interior decals</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Service 3: Backdrops */}
                                    <div className="col-lg-4 col-12 mb-4">
                                        <div className="service-tile bg-white border shadow-sm p-4 h-100">
                                            <div className="mb-4 d-flex align-items-center justify-content-center bg-grey-light" style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                                                <span className="text-grey small fw-bold">BACKDROP IMAGE</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <svg className="icon-sm text-dark"><use xlinkHref="#icon-globe" /></svg>
                                                <h4 className="h5 fw-bold mb-0">Backdrops</h4>
                                            </div>
                                            <ul className="list-unstyled text-grey-dark small">
                                                <li className="mb-2">• Media wall installation</li>
                                                <li className="mb-2">• Event photo backgrounds</li>
                                                <li className="mb-2">• Stage and theater sets</li>
                                                <li>• Tension fabric displays</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Block 3: Installation Process */}
                            <div className="mb-5 pb-5">
                                <h3 className="text-center fw-bold mb-5">Installation Process</h3>
                                <div className="row g-4">
                                    <div className="col-md-3 text-center">
                                        <div className="display-4 fw-bold text-grey-light mb-3">01</div>
                                        <h5 className="fw-bold">CONSULTATION</h5>
                                        <p className="small text-grey-dark">Initial site assessment and surface compatibility check.</p>
                                    </div>
                                    <div className="col-md-3 text-center">
                                        <div className="display-4 fw-bold text-grey-light mb-3">02</div>
                                        <h5 className="fw-bold">PREPARATION</h5>
                                        <p className="small text-grey-dark">Surface cleaning and precise measurement verification.</p>
                                    </div>
                                    <div className="col-md-3 text-center">
                                        <div className="display-4 fw-bold text-grey-light mb-3">03</div>
                                        <h5 className="fw-bold">APPLICATION</h5>
                                        <p className="small text-grey-dark">Expert application using professional-grade tools.</p>
                                    </div>
                                    <div className="col-md-3 text-center">
                                        <div className="display-4 fw-bold text-grey-light mb-3">04</div>
                                        <h5 className="fw-bold">FINISHING</h5>
                                        <p className="small text-grey-dark">Final edge sealing and site cleanup for a perfect result.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Block 4: Why Choose Us */}
                            <div className="installation-benefits pb-5">
                                <h3 className="text-center fw-bold mb-5">Why Choose Us</h3>
                                <div className="row">
                                    <div className="col-lg-3 col-md-6 col-12 mb-4">
                                        <div className="benefit-tile p-4 border text-center bg-white h-100">
                                            <div className="mb-3">
                                                <svg className="icon-sm text-dark" style={{ width: '2rem', height: '2rem' }}>
                                                    <use xlinkHref="#icon-check" />
                                                </svg>
                                            </div>
                                            <h5 className="fw-bold small">EXPERT TEAM</h5>
                                            <p className="small text-grey-dark mb-0">Certified installers with years of experience.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-12 mb-4">
                                        <div className="benefit-tile p-4 border text-center bg-white h-100">
                                            <div className="mb-3">
                                                <svg className="icon-sm text-dark" style={{ width: '2rem', height: '2rem' }}>
                                                    <use xlinkHref="#icon-check" />
                                                </svg>
                                            </div>
                                            <h5 className="fw-bold small">FULLY INSURED</h5>
                                            <p className="small text-grey-dark mb-0">Public liability insurance for your peace of mind.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-12 mb-4">
                                        <div className="benefit-tile p-4 border text-center bg-white h-100">
                                            <div className="mb-3">
                                                <svg className="icon-sm text-dark" style={{ width: '2rem', height: '2rem' }}>
                                                    <use xlinkHref="#icon-check" />
                                                </svg>
                                            </div>
                                            <h5 className="fw-bold small">NATIONWIDE</h5>
                                            <p className="small text-grey-dark mb-0">Serving London and the entire United Kingdom.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-12 mb-4">
                                        <div className="benefit-tile p-4 border text-center bg-white h-100">
                                            <div className="mb-3">
                                                <svg className="icon-sm text-dark" style={{ width: '2rem', height: '2rem' }}>
                                                    <use xlinkHref="#icon-check" />
                                                </svg>
                                            </div>
                                            <h5 className="fw-bold small">WARRANTED</h5>
                                            <p className="small text-grey-dark mb-0">Installation guarantee on all of our workmanship.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Installation;

