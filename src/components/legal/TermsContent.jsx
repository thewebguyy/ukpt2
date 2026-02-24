import React from 'react';
import { Link } from 'react-router-dom';

const TermsContent = () => {
    return (
        <div className="legal-prose">
            <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">1. ACCEPTANCE OF TERMS</h2>
                <p>By accessing and using CustomiseMe UK ("the Website") and our services, you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, please do not use our services.</p>
            </section>

            <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">2. PRODUCTS & SERVICES</h2>
                <p>We make every effort to display the colors and details of our products accurately. However, we cannot guarantee that your device's display will be completely accurate. All descriptions of products or product pricing are subject to change at any time without notice.</p>
            </section>

            <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">3. CUSTOM ORDERS</h2>
                <p>For custom printing and embroidery services:</p>
                <ul className="mb-3">
                    <li>You are responsible for ensuring all uploaded designs do not infringe on any third-party copyrights or trademarks.</li>
                    <li>We reserve the right to refuse any order containing content we deem offensive or inappropriate.</li>
                    <li>Digital proofs must be approved before production begins. Once approved, CustomiseMe UK is not responsible for errors present in the proof.</li>
                </ul>
            </section>

            <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">4. "SEND YOUR OWN" SERVICE</h2>
                <p>When sending your own items to us for customisation:</p>
                <ul className="mb-3">
                    <li>Items are sent at your own risk. We recommend tracked and insured shipping.</li>
                    <li>While we take every precaution, some fabrics may react unexpectedly to our processes. CustomiseMe UK is not liable for damage to customer-provided items during the customisation process beyond the value of the service provided.</li>
                </ul>
            </section>

            <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">5. PRICING & PAYMENT</h2>
                <p>All prices are in GBP (£). We reserve the right to change prices at any time. Payment must be made in full before orders are dispatched or custom production begins.</p>
            </section>

            <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">6. SHIPPING & DELIVERY</h2>
                <p>Delivery dates are estimates and not guaranteed. CustomiseMe UK is not responsible for delays caused by shipping carriers or customs clearance for international orders.</p>
            </section>

            <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">7. RETURNS & REFUNDS</h2>
                <p>Due to the nature of custom-made products, we cannot accept returns or offer refunds unless the item is faulty or an error was made on our part during production.</p>
                <p>For non-custom items, you have 14 days from receipt to request a return, provided the items are in original condition.</p>
            </section>

            <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">8. PRIVACY</h2>
                <p>Your use of the Website is also governed by our <Link to="/privacy-policy" className="text-decoration-underline text-black">Privacy Policy</Link>, which describes how we handle the personal information you provide to us.</p>
            </section>

            <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">9. INTELLECTUAL PROPERTY</h2>
                <p>The Website and its original content, features, and functionality are owned by CustomiseMe UK and are protected by international copyright, trademark, and other intellectual property laws.</p>
            </section>

            <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">10. LIMITATION OF LIABILITY</h2>
                <p>In no event shall CustomiseMe UK be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
            </section>

            <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">11. CONTACT INFORMATION</h2>
                <p>If you have any questions about these Terms and Conditions, please contact us:</p>
                <ul className="list-unstyled">
                    <li><strong>Email:</strong> <a href="mailto:info@customisemeuk.com" className="text-black">info@customisemeuk.com</a></li>
                    <li><strong>Phone:</strong> <a href="tel:07588770901" className="text-black">07588770901</a></li>
                </ul>
            </section>
        </div>
    );
};

export default TermsContent;
