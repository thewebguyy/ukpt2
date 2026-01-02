/**
 * AUTHENTICATION MIDDLEWARE
 * JWT verification and authorization
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');

// ============================================
// VERIFY JWT TOKEN
// ============================================

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-this'
    );

    // Get user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Attach user to request object
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// ============================================
// CHECK IF USER IS ADMIN
// ============================================

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// ============================================
// OPTIONAL AUTHENTICATION
// (Doesn't fail if no token, but attaches user if token is valid)
// ============================================

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-this'
    );

    const user = await User.findById(decoded.id);

    if (user && user.isActive) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      };
    }

    next();

  } catch (error) {
    // Continue without user
    next();
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  optionalAuth
};