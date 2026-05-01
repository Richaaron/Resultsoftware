const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) throw new Error();

    // Check if teacher is active - prevent inactive teachers from accessing API
    if (user.role === 'TEACHER' && !user.isActive) {
      logger.warn(`Inactive teacher attempted API access: ${user.username}`);
      return res.status(403).send({ error: 'Your account has been deactivated.' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).send({ error: 'Forbidden' });
    }
    next();
  };
};

module.exports = { auth, authorize };
