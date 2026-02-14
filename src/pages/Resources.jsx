import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const resources = [
    {
        title: 'T-SHIRT DESIGN TEMPLATE',
        description: 'Download our t-shirt design template with print-safe zones, bleeds, and colour guides.',
        format: 'PDF / AI',
        category: 'Template'
    },
    {
        title: 'HOODIE DESIGN TEMPLATE',
        description: 'Front and back hoodie template optimised for DTG and screen printing.',
        format: 'PDF / AI',
        category: 'Template'
    },
    {
        title: 'TOTE BAG TEMPLATE',
        description: 'Canvas tote bag design template with handle placement and print area guides.',
        format: 'PDF / AI',
        category: 'Template'
    },
    {
        title: 'VINYL BANNER TEMPLATE',
        description: 'Large format banner template with safe area, bleed, and grommet positioning.',
        format: 'PDF',
        category: 'Template'
    },
    {
        title: 'COLOUR GUIDE',
        description: 'Our official colour palette with Pantone, CMYK, and HEX references for brand consistency.',
        format: 'PDF',
        category: 'Guide'
    },
    {
        title: 'ARTWORK PREPARATION GUIDE',
        description: 'Step-by-step guide to preparing your artwork files for print. Covers resolution, file types, and colour modes.',
        format: 'PDF',
        category: 'Guide'
    }
];

const Resources = () => {
    return (
        <div className="resources-page">
            <Helmet>
                <title>Design Resources - CustomiseMe UK</title>
            </Helmet>

            <section className="py-5 bg-dark text-white">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold mb-3">DESIGN RESOURCES</h1>
                    <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
                        Download templates, guides, and assets to help you prepare your designs for production.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="row g-4">
                        {resources.map((resource, i) => (
                            <div key={i} className="col-md-6 col-lg-4">
                                <div className="card border-0 shadow-sm p-4 h-100">
                                    <span className="badge bg-light text-dark mb-2 align-self-start">{resource.category}</span>
                                    <h5 className="fw-bold mb-2">{resource.title}</h5>
                                    <p className="text-muted small mb-3">{resource.description}</p>
                                    <div className="mt-auto d-flex justify-content-between align-items-center">
                                        <span className="small text-muted">{resource.format}</span>
                                        <button className="btn btn-outline-dark btn-sm">DOWNLOAD</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-5 pt-3">
                        <p className="text-muted mb-3">Need help with your design? Our team is here to assist.</p>
                        <Link to="/designservice" className="btn btn-dark px-5">
                            REQUEST DESIGN HELP
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Resources;
