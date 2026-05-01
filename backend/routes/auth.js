const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");
const { asyncHandler } = require("../middleware/errorHandler");
const logger = require("../utils/logger");
const { logActivity } = require("../utils/activityTracker");

router.post("/login", validate(schemas.login), asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Case-insensitive username search
  const user = await User.findOne({ 
    where: sequelize.where(
      sequelize.fn('lower', sequelize.col('username')), 
      sequelize.fn('lower', username)
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
