import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const workshops = [
    {
        title: 'SCREEN PRINTING 101',
        description: 'Learn the fundamentals of screen printing. Create your own custom t-shirt in this hands-on session.',
        duration: '3 hours',
        price: '£45 per person'
    },
    {
        title: 'DESIGN YOUR OWN BRAND',
        description: 'From logo creation to brand guidelines. Leave with a complete brand identity package.',
        duration: '4 hours',
        price: '£65 per person'
    },
    {
        title: 'TEAM BUILDING CREATIVE',
        description: 'Perfect for corporate events. Your team designs and prints custom merchandise together.',
        duration: '2-3 hours',
        price: 'From £35 per person'
    },
    {
        title: 'KIDS CREATIVE WORKSHOP',
        description: 'Fun, supervised sessions where kids can design and create their own custom products.',
        duration: '2 hours',
        price: '£25 per child'
    }
];

const Workshop = () => {
    return (
        <div className="workshop-page">
            <Helmet>
                <title>Workshops - CustomiseMe UK</title>
            </Helmet>

            <section className="py-5 bg-dark text-white">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold mb-3">WORKSHOPS</h1>
                    <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
                        Hands-on creative workshops for individuals, teams, and kids. Learn new skills and create something unique.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="row g-4">
                        {workshops.map((workshop, i) => (
                            <div key={i} className="col-md-6">
                                <div className="card border-0 shadow-sm p-4 h-100">
                                    <h3 className="h5 fw-bold mb-2">{workshop.title}</h3>
                                    <p className="text-muted mb-3">{workshop.description}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                                        <div className="small text-muted">
                                            <span className="me-3">Duration: {workshop.duration}</span>
                                        </div>
                                        <span className="fw-bold">{workshop.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-5 pt-3">
                        <p className="text-muted mb-3">Interested in booking a workshop? Get in touch with our team.</p>
                        <Link to="/contact?service=workshop" className="btn btn-dark px-5">
                            BOOK A WORKSHOP
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Workshop;
