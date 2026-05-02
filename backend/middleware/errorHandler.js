const logger = require('../utils/logger');

/**
 * Centralized error handling middleware
 * Catches all errors and returns consistent format
 */
const errorHandler = (err, req, res, next) => {
  // Default error properties
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error details (but not sensitive data)
  logger.error({
    status,
    message,
    path: req.path,
    method: req.method,
    userId: req.user?.id || 'anonymous',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Don't expose internal error details in production
  const isDev = process.env.NODE_ENV === 'development';
  const details = isDev ? err.details || message : undefined;

  // Validation errors (Joi)
  if (err.isJoi) {
    const isLoginPath = req.path.includes('login');
    const helpMessage = isLoginPath ? ' Please ensure you have entered both username and password.' : '';
    
    return res.status(400).json({
      status: 400,
      error: 'Validation Error',
      message: err.details.map(d => d.message.replace(/\"body\./g, '"')).join(', ') + helpMessage,
      ...(isDev && { details: err.details })
    });
  }

  // Sequelize errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      status: 409,
      error: 'Conflict',
      message: 'This record already exists'
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      status: 400,
      error: 'Validation Error',
      message: err.errors.map(e => e.message).join(', ')
    });
  }

  // Default response
  res.status(status).json({
    status,
    error: message,
    ...(isDev && { details })
  });
};

// Async error wrapper to avoid try-catch in every route
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
