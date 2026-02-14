import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const services = [
    {
        title: 'SEND ITEMS',
        description: 'Send your own items to us for custom printing, embroidery, or embellishment. We\'ll transform your garments with professional-grade customisation.',
        link: '/senditems',
        cta: 'LEARN MORE'
    },
    {
        title: 'SUBSCRIPTIONS',
        description: 'Regular deliveries and exclusive benefits for individuals and businesses. Save more with our subscription plans.',
        link: '/subscriptions',
        cta: 'VIEW PLANS'
    },
    {
        title: 'INSTALLATION',
        description: 'Professional installation service for large format prints, vinyl banners, and wall graphics. We come to you.',
        link: '/installation',
        cta: 'GET A QUOTE'
    },
    {
        title: 'WORKSHOP',
        description: 'Join our hands-on workshops to learn design, screen printing, and customisation techniques. Perfect for team building and creative sessions.',
        link: '/workshop',
        cta: 'BOOK A SESSION'
    }
];

const PremiumServices = () => {
    return (
        <div className="premium-services-page">
            <Helmet>
                <title>Premium Services - CustomiseMe UK</title>
            </Helmet>

            <section className="py-5 bg-dark text-white">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold mb-3">PREMIUM SERVICES</h1>
                    <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
                        Go beyond the shop with our premium service offerings. From bespoke installations to creative workshops.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="row g-4">
                        {services.map((service, i) => (
                            <div key={i} className="col-md-6">
                                <div className="card border-0 shadow-sm p-5 h-100">
                                    <h3 className="h4 fw-bold mb-3">{service.title}</h3>
                                    <p className="text-muted mb-4">{service.description}</p>
                                    <div className="mt-auto">
                                        <Link to={service.link} className="btn btn-dark w-100">
                                            {service.cta}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-5 pt-3">
                        <p className="text-muted mb-3">Have a custom requirement? We're here to help.</p>
                        <Link to="/contact?service=design" className="btn btn-outline-dark px-5">
                            CONTACT US
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PremiumServices;
