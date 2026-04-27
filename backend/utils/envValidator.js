const logger = require('./logger');

/**
 * Validate required environment variables on startup
 */
const validateEnv = () => {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  // Validate JWT_SECRET is strong enough
  if (process.env.JWT_SECRET.length < 32) {
    logger.warn('JWT_SECRET is less than 32 characters. Consider using a stronger secret.');
  }

  logger.info('Environment validation passed');
};

module.exports = { validateEnv };
