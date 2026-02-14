/**
 * Brevo API helper for Firebase Functions - uses REST API to avoid ESM/CommonJS issues
 */

const BREVO_API_URL = 'https://api.brevo.com/v3';
const BASE_URL = 'https://customisemeuk.com';

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function sendTransactionalEmail(apiKey, { to, subject, htmlContent, textContent }, senderEmail = 'noreply@customisemeuk.com') {
    const res = await fetch(`${BREVO_API_URL}/smtp/email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey
        },
        body: JSON.stringify({
            sender: { name: 'Customise Me UK', email: senderEmail },
            to: Array.isArray(to) ? to : [{ email: to, name: to }],
            subject,
            htmlContent: htmlContent || '',
            textContent: textContent || ''
        })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.message || data.code || `Brevo API error: ${res.status}`);
    }
    return data.messageId;
}

function getWelcomeEmailHtml(firstName, discountCode) {
    return `
<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f5f5f5">
<div style="max-width:600px;margin:20px auto;background:#fff">
<div style="text-align:center;padding:30px 20px;background:#000;color:#fff"><h1 style="margin:0;letter-spacing:3px">CUSTOMISE ME UK</h1></div>
<div style="padding:30px 20px">
<h2 style="margin-top:0">Welcome to Customise Me UK!</h2>
<p>Hi ${escapeHtml(firstName)},</p>
<p>Thank you for subscribing. Use this code for 10% off your first order:</p>
<div style="background:#f9f9f9;padding:20px;text-align:center;margin:25px 0;border:2px dashed #000">
<p style="margin:0;font-weight:bold">YOUR WELCOME DISCOUNT</p>
<p style="font-size:2em;font-weight:bold;margin:10px 0;letter-spacing:3px">${escapeHtml(discountCode)}</p>
</div>
<p style="text-align:center"><a href="${BASE_URL}/shop" style="display:inline-block;padding:14px 28px;background:#000;color:#fff!important;text-decoration:none;font-weight:bold">SHOP NOW</a></p>
</div>
<div style="text-align:center;font-size:0.8em;color:#999;padding:20px;border-top:1px solid #eee">
<p>Customise Me UK | <a href="${BASE_URL}/unsubscribe" style="color:#999">Unsubscribe</a></p>
</div></div></body></html>`;
}

function getOrderConfirmationHtml(order, orderId) {
    const itemsHtml = (order.items || []).map(item => {
        let opts = '';
        if (item.customization) {
            const arr = [];
            if (item.customization.size) arr.push(`Size: ${escapeHtml(item.customization.size)}`);
            if (item.customization.color) arr.push(`Color: ${escapeHtml(item.customization.color)}`);
            if (arr.length) opts = `<div style="font-size:0.85em;color:#666">${arr.join(' | ')}</div>`;
        }
        return `<div style="padding:10px 0;border-bottom:1px solid #eee"><strong>${escapeHtml(item.name)}</strong>${opts}<span>x${item.quantity}</span></div>`;
    }).join('');

    const addr = order.shippingAddress || {};
    const addrStr = [addr.name, addr.address, `${addr.city || ''} ${addr.postcode || ''}`.trim(), 'United Kingdom'].filter(Boolean).join(', ');

    return `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f5f5f5">
<div style="max-width:600px;margin:20px auto;background:#fff">
<div style="text-align:center;padding:30px;background:#000;color:#fff"><h1 style="margin:0">CUSTOMISE ME UK</h1></div>
<div style="padding:30px">
<h2>Thank you for your order!</h2>
<p>Hi ${escapeHtml(addr.name || 'there')},</p>
<p>We've received your payment. You'll get another email when your order ships.</p>
<div style="background:#f9f9f9;padding:15px;margin:20px 0"><strong>Order:</strong> ${orderId} | <strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
<h3>Items</h3>${itemsHtml}
<div style="margin-top:20px;border-top:2px solid #eee;padding-top:10px">
<div style="display:flex;justify-content:space-between;font-weight:bold"><span>TOTAL</span><span>£${Number(order.total || 0).toFixed(2)}</span></div>
</div>
<div style="margin-top:30px"><h3>Shipping To</h3><p>${escapeHtml(addrStr || '—')}</p></div>
<p style="text-align:center;margin-top:30px"><a href="${BASE_URL}/order-tracking" style="display:inline-block;padding:14px 28px;background:#000;color:#fff!important;text-decoration:none;font-weight:bold">VIEW ORDER STATUS</a></p>
</div>
<div style="text-align:center;font-size:0.8em;color:#999;padding:20px">Customise Me UK</div>
</div></body></html>`;
}

function getShippingNotificationHtml(data) {
    return `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f5f5f5">
<div style="max-width:600px;margin:20px auto;background:#fff">
<div style="text-align:center;padding:30px;background:#000;color:#fff"><h1 style="margin:0">CUSTOMISE ME UK</h1></div>
<div style="padding:30px">
<h2>Your Order Has Been Shipped!</h2>
<p>Hi ${escapeHtml(data.firstName || 'there')},</p>
<p>Your order <strong>${escapeHtml(data.orderId)}</strong> is on its way.</p>
<div style="background:#f9f9f9;padding:15px;margin:20px 0">
<strong>Tracking:</strong> ${escapeHtml(data.trackingNumber || 'TBD')}<br>
<strong>Carrier:</strong> ${escapeHtml(data.carrier || 'Royal Mail')}<br>
<strong>Estimated Delivery:</strong> ${escapeHtml(data.estimatedDelivery || '3-5 business days')}
</div>
<p style="text-align:center;margin-top:30px"><a href="${BASE_URL}/order-tracking" style="display:inline-block;padding:14px 28px;background:#000;color:#fff!important;text-decoration:none;font-weight:bold">TRACK YOUR ORDER</a></p>
</div></div></body></html>`;
}

function getAccountWelcomeHtml(data) {
    return `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f5f5f5">
<div style="max-width:600px;margin:20px auto;background:#fff">
<div style="text-align:center;padding:30px;background:#000;color:#fff"><h1 style="margin:0">CUSTOMISE ME UK</h1></div>
<div style="padding:30px">
<h2>Welcome to Customise Me UK!</h2>
<p>Hi ${escapeHtml(data.name || 'there')},</p>
<p>Your account has been created. Track orders, save wishlists, and access exclusive offers.</p>
<p style="text-align:center;margin-top:30px"><a href="${BASE_URL}/account" style="display:inline-block;padding:14px 28px;background:#000;color:#fff!important;text-decoration:none;font-weight:bold">GO TO YOUR ACCOUNT</a></p>
</div></div></body></html>`;
}

module.exports = {
    async sendWelcomeEmail(apiKey, email, firstName = '', senderEmail = 'noreply@customisemeuk.com') {
        const name = (firstName || '').trim() || 'there';
        return sendTransactionalEmail(apiKey, {
            to: [{ email, name }],
            subject: 'Welcome to Customise Me UK! 10% Off Your First Order',
            htmlContent: getWelcomeEmailHtml(name, 'WELCOME10')
        }, senderEmail);
    },
    async sendOrderConfirmation(apiKey, order, orderId, senderEmail = 'noreply@customisemeuk.com') {
        return sendTransactionalEmail(apiKey, {
            to: [{ email: order.email, name: (order.shippingAddress?.name || 'Customer') }],
            subject: `Order Confirmed: ${orderId}`,
            htmlContent: getOrderConfirmationHtml(order, orderId)
        }, senderEmail);
    },
    async sendShippingNotification(apiKey, { email, firstName, orderId, trackingNumber, carrier, estimatedDelivery }, senderEmail = 'noreply@customisemeuk.com') {
        return sendTransactionalEmail(apiKey, {
            to: [{ email, name: firstName || 'Customer' }],
            subject: `Your Order ${orderId} Has Been Shipped!`,
            htmlContent: getShippingNotificationHtml({
                firstName: firstName || 'there',
                orderId,
                trackingNumber: trackingNumber || 'TBD',
                carrier: carrier || 'Royal Mail',
                estimatedDelivery: estimatedDelivery || '3-5 business days'
            })
        }, senderEmail);
    },
    async sendAccountWelcome(apiKey, { email, name }, senderEmail = 'noreply@customisemeuk.com') {
        return sendTransactionalEmail(apiKey, {
            to: [{ email, name: name || 'Customer' }],
            subject: 'Welcome to Customise Me UK — Account Created',
            htmlContent: getAccountWelcomeHtml({ name: name || 'there' })
        }, senderEmail);
    }
};
