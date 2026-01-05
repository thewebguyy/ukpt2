/**
 * CONTACT ROUTES — Production Grade
 * Handles contact submissions and admin management.
 */

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Contact } = require('../models');
const {
  sendContactConfirmationEmail,
  sendAdminNotification,
} = require('../services/email.service');
const {
  authenticateToken,
  isAdmin,
  userRateLimit,
} = require('./auth.middleware');

/* ------------------------------------------------
   Validation Schemas
------------------------------------------------ */

const submitSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().max(255).required(),
  phone: Joi.string().trim().max(20).optional(),
  service: Joi.string().trim().max(100).optional(),
  message: Joi.string().trim().min(10).max(2000).required(),
}).options({ abortEarly: false, stripUnknown: true });

const statusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'in-progress', 'resolved', 'closed')
    .required(),
  notes: Joi.string().trim().max(1000).optional(),
}).options({ abortEarly: false, stripUnknown: true });

/* ------------------------------------------------
   SUBMIT CONTACT FORM
------------------------------------------------ */

router.post(
  '/submit',
  userRateLimit(5, 60 * 1000),
  async (req, res) => {
    try {
      const { error, value } = submitSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: error.details.map((d) => d.message),
        });
      }

      const contact = await Contact.create({
        ...value,
        status: 'pending',
        replied: false,
      });

      // Fire-and-forget emails
      Promise.allSettled([
        sendContactConfirmationEmail(contact),
        sendAdminNotification('new-contact', contact),
      ]);

      return res.status(201).json({
        success: true,
        message: 'Message received successfully',
        data: { id: contact._id },
      });
    } catch (err) {
      console.error('Contact submit error:', err);

      return res.status(500).json({
        success: false,
        message: 'Unable to process request at this time',
      });
    }
  }
);

/* ------------------------------------------------
   GET ALL CONTACTS (ADMIN)
------------------------------------------------ */

router.get(
  '/',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const skip = (page - 1) * limit;

      const query = {};

      if (req.query.status) {
        query.status = req.query.status;
      }

      if (req.query.search) {
        const safeSearch = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(safeSearch, 'i');

        query.$or = [
          { name: regex },
          { email: regex },
          { service: regex },
        ];
      }

      const [contacts, total] = await Promise.all([
        Contact.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Contact.countDocuments(query),
      ]);

      return res.json({
        success: true,
        data: {
          contacts,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (err) {
      console.error('Fetch contacts error:', err);

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch contact messages',
      });
    }
  }
);

/* ------------------------------------------------
   UPDATE CONTACT STATUS (ADMIN)
------------------------------------------------ */

router.patch(
  '/:id/status',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { error, value } = statusSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status update',
          errors: error.details.map((d) => d.message),
        });
      }

      const resolved = ['resolved', 'closed'].includes(value.status);

      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        {
          status: value.status,
          notes: value.notes,
          replied: resolved,
          repliedAt: resolved ? new Date() : null,
        },
        { new: true }
      );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found',
        });
      }

      return res.json({
        success: true,
        message: 'Status updated successfully',
        data: contact,
      });
    } catch (err) {
      console.error('Update status error:', err);

      return res.status(500).json({
        success: false,
        message: 'Failed to update contact status',
      });
    }
  }
);

module.exports = router;
