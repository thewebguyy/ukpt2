import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const About = () => {
    return (
        <div className="about-page">
            <Helmet>
                <title>About Us - CustomiseMe UK</title>
                <meta name="description" content="Learn about CustomiseMe UK, our mission, and our dedication to premium custom printing and design." />
            </Helmet>

            {/* Hero-style Header Section */}
            <section className="py-5 text-center" style={{ backgroundColor: 'var(--color-grey-light)' }}>
                <div className="container">
                    <h1 className="display-4 fw-bold mb-3">ABOUT US</h1>
                    <p className="lead text-grey-dark mx-auto" style={{ maxWidth: '600px' }}>
                        Premium custom printing and design services crafted with care in the UK.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="section py-5">
                <div className="container container-text text-center">
                    <p className="mb-4">
                        CustomiseMe UK was founded with a simple mission: to make professional-quality
                        custom printing accessible to everyone. Whether you're planning a personal celebration,
                        launching a new business venture, or creating unique branded gifts, we're here
                        to bring your creative vision to life with precision and style.
                    </p>
                    <p className="mb-4">
                        Based in the heart of the UK, we combine cutting-edge printing technology with
                        a passion for exceptional design. Our range of services extends from small
                        personalised orders to large-scale commercial installations, ensuring that every
                        project receives the same dedicated attention to detail and quality finish
                        that defines our brand.
                    </p>
                    <p className="mb-5">
                        We believe in more than just printing; we believe in helping you create moments
                        and build identities. From our 3D design studio to our professional on-site
                        installation teams, every aspect of CustomiseMe UK is designed to provide
                        a seamless, premium experience for every client.
                    </p>

                    <Link to="/contact" className="btn btn-dark btn-lg px-5">
                        GET IN TOUCH
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;

