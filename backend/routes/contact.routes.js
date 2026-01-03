/**
 * CONTACT ROUTES
 * Contact form submissions and inquiries
 */

const express = require('express');
const router = express.Router();
const { Contact } = require('../models');
const { sendContactConfirmationEmail, sendAdminNotification } = require('../services/email.service');

// ============================================
// SUBMIT CONTACT FORM
// ============================================

router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    // Create contact message
    const contact = new Contact({
      name,
      email,
      phone,
      service,
      message
    });

    await contact.save();

    // Send confirmation email to user
    try {
      await sendContactConfirmationEmail(contact);
    } catch (emailError) {
      console.error('Contact confirmation email error:', emailError);
    }

    // Notify admin
    try {
      await sendAdminNotification('new-contact', contact);
    } catch (emailError) {
      console.error('Admin notification error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We\'ll get back to you within 24 hours.',
      data: {
        id: contact._id
      }
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// ============================================
// GET ALL CONTACT MESSAGES (Admin only)
// ============================================

router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const contacts = await Contact.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    });
  }
});

// ============================================
// UPDATE CONTACT STATUS (Admin only)
// ============================================

router.patch('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes,
        replied: status === 'resolved' || status === 'closed',
        repliedAt: status === 'resolved' || status === 'closed' ? new Date() : undefined
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: { contact }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
});

module.exports = router;