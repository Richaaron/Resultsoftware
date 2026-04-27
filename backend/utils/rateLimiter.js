const rateLimit = require('express-rate-limit');

/**
 * Rate limiters for different endpoints
 */

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      error: 'Too Many Requests',
      message: 'Too many login attempts. Please try again in 15 minutes.'
    });
  },
  skip: (req) => process.env.NODE_ENV === 'test'
});

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test'
});

// Moderate rate limiting for data operations
const dateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  skip: (req) => process.env.NODE_ENV === 'test'
});

module.exports = {
  authLimiter,
  apiLimiter,
  dateLimiter
};
