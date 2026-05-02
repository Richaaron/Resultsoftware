const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sequelize = require("../utils/db");
const { auth } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");
const { asyncHandler } = require("../middleware/errorHandler");
const logger = require("../utils/logger");
const { logActivity } = require("../utils/activityTracker");

// Robust body parser for serverless environments
const getRequestBody = (req) => {
  // 1. Standard Express body
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    return req.body;
  }

  // 2. Netlify/Lambda event body
  const event = req.apiGateway?.event || req.event;
  if (event?.body) {
    try {
      let body = event.body;
      if (event.isBase64Encoded && typeof body === 'string') {
        body = Buffer.from(body, 'base64').toString('utf8');
      }
      return typeof body === 'string' ? JSON.parse(body) : body;
    } catch (e) {
      logger.warn(`Failed to parse gateway body in route: ${e.message}`);
    }
  }

  // 3. Fallback to raw body if it's a string
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return {};
    }
  }

  return req.body || {};
};

router.post("/login", asyncHandler(async (req, res) => {
  const body = getRequestBody(req);
  const { username, password } = body;

  logger.info(`Login attempt for: ${username || 'missing username'}`);

  if (!username || !password) {
    return res.status(400).json({ 
      error: "Validation Error", 
      message: "Username and password are required. Please try refreshing the page." 
    });
  }

  // Case-insensitive username search
  const user = await User.findOne({ 
    where: sequelize.where(
      sequelize.fn('lower', sequelize.col('username')), 
      sequelize.fn('lower', username.trim())
    )
  });

  if (!user) {
    logger.warn(`Login attempt failed: User not found - ${username}`);
    return res.status(401).json({ error: "Invalid login credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    logger.warn(`Login attempt failed: Password mismatch for user - ${user.username}`);
    return res.status(401).json({ error: "Invalid login credentials" });
  }

  // Check if user (especially teachers) is active
  if (user.role === "TEACHER" && !user.isActive) {
    logger.warn(`Inactive teacher attempted login: ${user.username}`);
    return res.status(403).json({ error: "Your account has been deactivated. Please contact administration." });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  // Log login activity for teachers
  if (user.role === "TEACHER") {
    try {
      await logActivity(
        user.id,
        "LOGIN",
        `Teacher ${user.fullName} logged in`,
        req,
        null,
        "LOW"
      );
    } catch (error) {
      logger.warn(`Failed to log login activity: ${error.message}`);
    }
  }

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isFormTeacher: user.isFormTeacher,
      isSubjectTeacher: user.isSubjectTeacher,
      assignedClass: user.assignedClass,
      assignedSubject: user.assignedSubject,
      profileImage: user.profileImage,
    }
  });
}));

router.get("/profile", auth, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isFormTeacher: user.isFormTeacher,
    isSubjectTeacher: user.isSubjectTeacher,
    assignedClass: user.assignedClass,
    assignedSubject: user.assignedSubject,
    profileImage: user.profileImage,
  });
}));

module.exports = router;
