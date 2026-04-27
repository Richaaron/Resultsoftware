const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");
const { asyncHandler } = require("../middleware/errorHandler");
const logger = require("../utils/logger");

router.post("/login", validate(schemas.login), asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ error: "Invalid login credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: "Invalid login credentials" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

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
