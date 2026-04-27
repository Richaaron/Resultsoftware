const pino = require('pino');

// Configure logger based on environment
const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  } : undefined,
  timestamp: pino.stdTimeFunctions.isoTime
});

// Child logger factory for request context
const getRequestLogger = (req) => {
  return logger.child({
    requestId: req.id,
    userId: req.user?.id,
    path: req.path,
    method: req.method
  });
};

module.exports = logger;
module.exports.getRequestLogger = getRequestLogger;
