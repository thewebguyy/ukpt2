/**
 * EMAIL SERVICE
 * Handles all transactional emails
 */

const nodemailer = require('nodemailer');

// ============================================
// EMAIL TRANSPORTER CONFIGURATION
// ============================================

const createTransporter = () => {
  // For production, use your email service
  // This example uses Gmail (you can also use SendGrid, Mailgun, etc.)
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Alternative: Using SMTP directly
  /*
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
  */
};

// ============================================
// EMAIL TEMPLATES
// ============================================

const emailTemplates = {
  welcome: (user) => ({
    subject: 'Welcome to Creative Merch UK! 🎨',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #000; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f5f5f5; }
          .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #9CA3AF; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CREATIVE MERCH UK</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${user.name}!</h2>
            <p>Thank you for joining Creative Merch UK. We're excited to have you as part of our community.</p>
            <p>With your account, you can:</p>
            <ul>
              <li>Track your orders</li>
              <li>Save favorite products</li>
              <li>Get exclusive offers</li>
              <li>Access our design studio</li>
            </ul>
            <a href="${process.env.FRONTEND_URL}/shop" class="button">START SHOPPING</a>
            <p>If you have any questions, feel free to reach out to us at <a href="mailto:info@customisemeuk.com">info@customisemeuk.com</a></p>
          </div>
          <div class="footer">
            <p>© 2026 Creative Merch UK. All rights reserved.</p>
            <p>📧 info@customisemeuk.com | 📱 07588770901</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderConfirmation: (order) => ({
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #000; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f5f5f5; }
          .order-items { background: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .item { padding: 15px 0; border-bottom: 1px solid #e5e5e5; }
          .item:last-child { border-bottom: none; }
          .total { font-size: 18px; font-weight: 600; padding: 15px 0; border-top: 2px solid #000; margin-top: 15px; }
          .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #9CA3AF; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ORDER CONFIRMED</h1>
            <p style="margin: 0;">Order #${order.orderNumber}</p>
          </div>
          <div class="content">
            <h2>Thank you for your order!</h2>
            <p>Hi ${order.shippingAddress.name},</p>
            <p>We've received your order and will process it shortly. You'll receive another email when your items ship.</p>
            
            <div class="order-items">
              <h3>Order Summary</h3>
              ${order.items.map(item => `
                <div class="item">
                  <strong>${item.name}</strong><br>
                  Quantity: ${item.quantity} × £${item.price.toFixed(2)} = £${item.subtotal.toFixed(2)}
                </div>
              `).join('')}
              
              <div style="padding: 15px 0; margin-top: 15px;">
                <div>Subtotal: £${order.pricing.subtotal.toFixed(2)}</div>
                <div>Shipping: £${order.pricing.shipping.toFixed(2)}</div>
                <div>Tax (VAT): £${order.pricing.tax.toFixed(2)}</div>
                <div class="total">Total: £${order.pricing.total.toFixed(2)}</div>
              </div>
            </div>

            <h3>Shipping Address</h3>
            <p>
              ${order.shippingAddress.name}<br>
              ${order.shippingAddress.street}${order.shippingAddress.apartment ? ', ' + order.shippingAddress.apartment : ''}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postcode}<br>
              ${order.shippingAddress.country}
            </p>

            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="button">VIEW ORDER</a>
          </div>
          <div class="footer">
            <p>© 2026 Creative Merch UK. All rights reserved.</p>
            <p>📧 info@customisemeuk.com | 📱 07588770901</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  contactConfirmation: (contact) => ({
    subject: 'We received your message - Creative Merch UK',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #000; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f5f5f5; }
          .footer { text-align: center; padding: 20px; color: #9CA3AF; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>MESSAGE RECEIVED</h1>
          </div>
          <div class="content">
            <h2>Thank you for contacting us!</h2>
            <p>Hi ${contact.name},</p>
            <p>We've received your message and will get back to you within 24 hours.</p>
            <p><strong>Your message:</strong></p>
            <p style="background: #fff; padding: 15px; border-radius: 8px;">${contact.message}</p>
            <p>If you have any urgent questions, please call us at 07588770901.</p>
          </div>
          <div class="footer">
            <p>© 2026 Creative Merch UK. All rights reserved.</p>
            <p>📧 info@customisemeuk.com | 📱 07588770901</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (user, resetUrl) => ({
    subject: 'Password Reset Request - Creative Merch UK',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #000; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f5f5f5; }
          .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #9CA3AF; font-size: 12px; }
          .warning { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PASSWORD RESET</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${resetUrl}" class="button">RESET PASSWORD</a>
            <p>This link will expire in 1 hour.</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              If you didn't request this password reset, please ignore this email or contact us if you have concerns.
            </div>
          </div>
          <div class="footer">
            <p>© 2026 Creative Merch UK. All rights reserved.</p>
            <p>📧 info@customisemeuk.com | 📱 07588770901</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// ============================================
// EMAIL SENDING FUNCTIONS
// ============================================

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Creative Merch UK" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Email send error:', error);
    throw error;
  }
};

// Specific email functions
const sendWelcomeEmail = async (user) => {
  const template = emailTemplates.welcome(user);
  return await sendEmail(user.email, template.subject, template.html);
};

const sendOrderConfirmationEmail = async (order) => {
  const template = emailTemplates.orderConfirmation(order);
  return await sendEmail(order.shippingAddress.email, template.subject, template.html);
};

const sendContactConfirmationEmail = async (contact) => {
  const template = emailTemplates.contactConfirmation(contact);
  return await sendEmail(contact.email, template.subject, template.html);
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  const template = emailTemplates.passwordReset(user, resetUrl);
  return await sendEmail(user.email, template.subject, template.html);
};

// ============================================
// ADMIN NOTIFICATION EMAILS
// ============================================

const sendAdminNotification = async (type, data) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'info@customisemeuk.com';
  
  let subject, html;

  switch (type) {
    case 'new-order':
      subject = `New Order: ${data.orderNumber}`;
      html = `
        <h2>New Order Received</h2>
        <p><strong>Order:</strong> ${data.orderNumber}</p>
        <p><strong>Customer:</strong> ${data.shippingAddress.name}</p>
        <p><strong>Total:</strong> £${data.pricing.total.toFixed(2)}</p>
        <a href="${process.env.ADMIN_URL}/orders/${data._id}">View Order</a>
      `;
      break;

    case 'new-contact':
      subject = `New Contact Message from ${data.name}`;
      html = `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `;
      break;

    default:
      return;
  }

  return await sendEmail(adminEmail, subject, html);
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendContactConfirmationEmail,
  sendPasswordResetEmail,
  sendAdminNotification
};