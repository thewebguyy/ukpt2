import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icons from '../components/common/Icons';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CartOffcanvas from '../components/cart/CartOffcanvas';

import SendItemsHero from '../components/senditems/SendItemsHero';
import SendItemsIntro from '../components/senditems/SendItemsIntro';
import ProcessStepsRow from '../components/senditems/ProcessStepsRow';
import SendItemsForm from '../components/senditems/SendItemsForm';
import TermsBlock from '../components/senditems/TermsBlock';
import LiabilityDownload from '../components/senditems/LiabilityDownload';

import { useAuthStore } from '../store/authStore';

const SendItems = () => {
    const initListener = useAuthStore(state => state.initListener);

    useEffect(() => {
        window.scrollTo(0, 0);
        const unsubscribe = initListener();
        return () => unsubscribe();
    }, [initListener]);

    return (
        <div className="send-items-page">
            <Helmet>
                <title>Send Your Items | CustomiseMe UK</title>
                <meta name="description" content="Send us your own clothing, bags, or accessories for professional customisation. High-quality DTG printing and embroidery on your own items." />
            </Helmet>

            <Icons />
            <Header />

            <main>
                <SendItemsHero />

                <section className="section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-10">
                                <SendItemsIntro />
                                <ProcessStepsRow />
                                <SendItemsForm />
                                <TermsBlock />
                                <LiabilityDownload />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <CartOffcanvas />
        </div>
    );
};

export default SendItems;
