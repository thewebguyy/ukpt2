/**
 * EMAIL TEMPLATES for Cloud Functions
 */

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const baseUrl = 'https://customisemeuk.com';

/**
 * Shared email wrapper with branding
 */
function wrapEmail(content, includeUnsubscribe = true) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
            .email-container { max-width: 600px; margin: 20px auto; background: #fff; border: 1px solid #eee; }
            .email-header { text-align: center; padding: 30px 20px; border-bottom: 2px solid #000; background: #000; color: #fff; }
            .email-header h1 { margin: 0; letter-spacing: 3px; font-size: 24px; }
            .email-content { padding: 30px 20px; }
            .email-footer { text-align: center; font-size: 0.8em; color: #999; padding: 20px; border-top: 1px solid #eee; background: #fafafa; }
            .btn { display: inline-block; padding: 14px 28px; background: #000; color: #fff !important; text-decoration: none; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; font-size: 14px; }
            .btn:hover { background: #333; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h1>CUSTOMISE ME UK</h1>
            </div>
            <div class="email-content">
                ${content}
            </div>
            <div class="email-footer">
                <p>Customise Me UK | Premium Designs & Bespoke Merch</p>
                <p>info@customisemeuk.com | 07588770901</p>
                <p>&copy; 2026 Customise Me UK. All rights reserved.</p>
                ${includeUnsubscribe ? `<p style="margin-top: 15px; font-size: 0.85em;"><a href="${baseUrl}/unsubscribe" style="color: #999;">Unsubscribe</a> from marketing emails</p>` : ''}
            </div>
        </div>
    </body>
    </html>
    `;
}

const getOrderConfirmationHTML = (order, orderId) => {
    const itemsHTML = order.items.map(item => {
        let optionsHTML = '';
        if (item.customization) {
            const opts = [];
            if (item.customization.size) opts.push(`Size: ${escapeHtml(item.customization.size)}`);
            if (item.customization.color) opts.push(`Color: ${escapeHtml(item.customization.color)}`);
            if (item.customization.printLocation) opts.push(`Print: ${escapeHtml(item.customization.printLocation)}`);
            if (item.customization.designPosition) opts.push(`Position: ${escapeHtml(item.customization.designPosition)}`);

            if (opts.length > 0) {
                optionsHTML += `<div style="font-size: 0.85em; color: #666; margin-top: 4px;">${opts.join(' | ')}</div>`;
            }

            if (item.customization.artwork) {
                optionsHTML += `<div style="font-size: 0.85em; margin-top: 4px;"><a href="${item.customization.artwork}" style="color: #059669; text-decoration: underline;">View Uploaded Artwork</a></div>`;
            }
        }

        return `
        <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <strong>${escapeHtml(item.name)}</strong>
                    ${optionsHTML}
                </div>
                <span>x${item.quantity}</span>
            </div>
            <div style="color: #666; font-size: 0.9em;">&pound;${item.price.toFixed(2)} each</div>
        </div>
    `}).join('');

    const content = `
        <h2 style="margin-top: 0;">Thank you for your order!</h2>
        <p>Hi ${escapeHtml(order.shippingAddress?.name || 'there')},</p>
        <p>We've received your payment and our team is now preparing your custom items. You'll receive another notification once your order has been shipped.</p>

        <div style="background: #f9f9f9; padding: 15px; margin: 20px 0;">
            <strong>Order Number:</strong> ${orderId}<br>
            <strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')}
        </div>

        <h3>Items</h3>
        ${itemsHTML}

        <div style="margin-top: 20px; border-top: 2px solid #eee; padding-top: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Subtotal:</span>
                <span>&pound;${order.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>VAT (20%):</span>
                <span>&pound;${order.tax.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Shipping:</span>
                <span>&pound;${order.shipping.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.2em; font-weight: bold; margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px;">
                <span>TOTAL:</span>
                <span>&pound;${order.total.toFixed(2)}</span>
            </div>
        </div>

        <div style="margin-top: 30px;">
            <h3>Shipping To:</h3>
            <p>
                ${escapeHtml(order.shippingAddress?.name || '')}<br>
                ${escapeHtml(order.shippingAddress?.address || '')}<br>
                ${escapeHtml(order.shippingAddress?.city || '')}, ${escapeHtml(order.shippingAddress?.postcode || '')}<br>
                United Kingdom
            </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <a href="${baseUrl}/order-tracking" class="btn">VIEW ORDER STATUS</a>
        </div>
    `;

    return wrapEmail(content, false);
};

const getContactEmailHTML = (data) => {
    return `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone || 'N/A')}</p>
        <p><strong>Service:</strong> ${escapeHtml(data.service)}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>
    </div>
    `;
};

const getWelcomeEmailHTML = (email) => {
    const content = `
        <h2 style="margin-top: 0;">Welcome to Customise Me UK!</h2>
        <p>Thank you for subscribing to our newsletter. You're now part of our community and will be the first to know about:</p>
        <ul style="padding-left: 20px;">
            <li>New product launches</li>
            <li>Exclusive discounts and offers</li>
            <li>Design tips and inspiration</li>
            <li>Early access to sales</li>
        </ul>

        <div style="background: #f9f9f9; padding: 20px; margin: 25px 0; text-align: center; border: 2px dashed #000;">
            <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 1.1em;">YOUR WELCOME DISCOUNT</p>
            <p style="font-size: 2em; font-weight: bold; margin: 10px 0; letter-spacing: 3px;">WELCOME10</p>
            <p style="margin: 0; color: #666;">Use this code for 10% off your first order</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <a href="${baseUrl}/shop" class="btn">SHOP NOW</a>
        </div>
    `;

    return wrapEmail(content, true);
};

const getShippingNotificationHTML = (data) => {
    const content = `
        <h2 style="margin-top: 0;">Your Order Has Been Shipped!</h2>
        <p>Great news! Your order <strong>${escapeHtml(data.orderId)}</strong> is on its way.</p>

        <div style="background: #f9f9f9; padding: 15px; margin: 20px 0;">
            <strong>Tracking Number:</strong> ${escapeHtml(data.trackingNumber || 'Will be updated shortly')}<br>
            <strong>Carrier:</strong> ${escapeHtml(data.carrier || 'Royal Mail')}<br>
            <strong>Estimated Delivery:</strong> ${escapeHtml(data.estimatedDelivery || '3-5 business days')}
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <a href="${baseUrl}/order-tracking" class="btn">TRACK YOUR ORDER</a>
        </div>

        <p style="margin-top: 30px; color: #666; font-size: 0.9em;">If you have any questions about your delivery, please don't hesitate to <a href="${baseUrl}/contact" style="color: #000;">contact us</a>.</p>
    `;

    return wrapEmail(content, false);
};

const getAccountCreationHTML = (data) => {
    const content = `
        <h2 style="margin-top: 0;">Welcome to Customise Me UK!</h2>
        <p>Hi ${escapeHtml(data.name || 'there')},</p>
        <p>Your account has been created successfully. You can now:</p>
        <ul style="padding-left: 20px;">
            <li>Track your orders in real time</li>
            <li>Save items to your wishlist</li>
            <li>Reorder your favourites quickly</li>
            <li>Access exclusive member offers</li>
        </ul>

        <div style="text-align: center; margin-top: 30px;">
            <a href="${baseUrl}/account" class="btn">GO TO YOUR ACCOUNT</a>
        </div>
    `;

    return wrapEmail(content, false);
};

const getContactConfirmationHTML = (data) => {
    const content = `
        <h2 style="margin-top: 0;">We've Received Your Message</h2>
        <p>Hi ${escapeHtml(data.name)},</p>
        <p>Thank you for contacting Customise Me UK. We've received your inquiry and will get back to you within <strong>24 hours</strong>.</p>

        <div style="background: #f9f9f9; padding: 15px; margin: 20px 0;">
            <strong>Your message:</strong>
            <p style="font-style: italic; color: #666;">"${escapeHtml(data.message)}"</p>
            <strong>Subject:</strong> ${escapeHtml(data.subject)}
        </div>

        <p>In the meantime, feel free to browse our latest products:</p>
        <div style="text-align: center; margin-top: 20px;">
            <a href="${baseUrl}/shop" class="btn">BROWSE PRODUCTS</a>
        </div>
    `;

    return wrapEmail(content, false);
};

const getPasswordResetHTML = (data) => {
    const content = `
        <h2 style="margin-top: 0;">Password Reset Request</h2>
        <p>Hi there,</p>
        <p>We received a request to reset your password for your Customise Me UK account. If you didn't make this request, you can safely ignore this email.</p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${escapeHtml(data.resetLink)}" class="btn">RESET YOUR PASSWORD</a>
        </div>

        <p style="color: #666; font-size: 0.9em;">This link will expire in 1 hour for security purposes.</p>
        <p style="color: #666; font-size: 0.9em;">If you didn't request a password reset, please contact us immediately at info@customisemeuk.com.</p>
    `;

    return wrapEmail(content, false);
};

module.exports = {
    getOrderConfirmationHTML,
    getContactEmailHTML,
    getWelcomeEmailHTML,
    getShippingNotificationHTML,
    getAccountCreationHTML,
    getContactConfirmationHTML,
    getPasswordResetHTML,
    escapeHtml
};
