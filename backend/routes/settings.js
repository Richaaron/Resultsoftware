const express = require("express");
const router = express.Router();
const Setting = require("../models/Setting");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");
const { auth, authorize } = require("../middleware/auth");

// Get current settings
router.get("/", async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json({
      id: settings.id,
      schoolName: settings.schoolName,
      logo: settings.logo,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      principalName: settings.principalName,
      principalSignature: settings.principalSignature,
      proprietressName: settings.proprietressName,
      proprietressSignature: settings.proprietressSignature,
      schoolAddress: settings.schoolAddress,
      schoolPhoneNumber: settings.schoolPhoneNumber,
      currentTerm: settings.currentTerm,
      currentAcademicYear: settings.currentAcademicYear,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings
router.put("/", auth, authorize(["ADMIN"]), async (req, res) => {
  try {
    const {
      schoolName,
      logo,
      primaryColor,
      secondaryColor,
      principalName,
      principalSignature,
      proprietressName,
      proprietressSignature,
      schoolAddress,
      schoolPhoneNumber,
      currentTerm,
      currentAcademicYear,
    } = req.body;

    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        schoolName,
        logo,
        primaryColor,
        secondaryColor,
        principalName,
        principalSignature,
        proprietressName,
        proprietressSignature,
        schoolAddress,
        schoolPhoneNumber,
        currentTerm,
        currentAcademicYear,
      });
    } else {
      await settings.update({
        ...(schoolName !== undefined && { schoolName }),
        ...(logo !== undefined && { logo }),
        ...(primaryColor !== undefined && { primaryColor }),
        ...(secondaryColor !== undefined && { secondaryColor }),
        ...(principalName !== undefined && { principalName }),
        ...(principalSignature !== undefined && { principalSignature }),
        ...(proprietressName !== undefined && { proprietressName }),
        ...(proprietressSignature !== undefined && { proprietressSignature }),
        ...(schoolAddress !== undefined && { schoolAddress }),
        ...(schoolPhoneNumber !== undefined && { schoolPhoneNumber }),
        ...(currentTerm !== undefined && { currentTerm }),
        ...(currentAcademicYear !== undefined && { currentAcademicYear }),
      });
    }

    res.json({
      id: settings.id,
      schoolName: settings.schoolName,
      logo: settings.logo,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      principalName: settings.principalName,
      principalSignature: settings.principalSignature,
      proprietressName: settings.proprietressName,
      proprietressSignature: settings.proprietressSignature,
      schoolAddress: settings.schoolAddress,
      schoolPhoneNumber: settings.schoolPhoneNumber,
      currentTerm: settings.currentTerm,
      currentAcademicYear: settings.currentAcademicYear,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password - available to all authenticated users
router.put("/change-password", auth, async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    logger.info(`[${requestId}] Password change request for user ${req.user.id}`);

    // Validation
    if (!currentPassword || !newPassword) {
      logger.warn(`[${requestId}] Missing fields in password change request`);
      return res.status(400).json({ error: "All fields are required" });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      logger.warn(`[${requestId}] Password mismatch in confirmation`);
      return res.status(400).json({ error: "New passwords do not match" });
    }

    if (newPassword.length < 6) {
      logger.warn(`[${requestId}] New password too short`);
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      logger.error(`[${requestId}] User ${req.user.id} not found during password change`);
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      logger.warn(`[${requestId}] Current password incorrect for user ${user.id}`);
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash and update new password
    logger.info(`[${requestId}] Hashing new password for user ${user.id}...`);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    logger.info(`[${requestId}] Updating database for user ${user.id}...`);
    await User.update(
      { password: hashedPassword },
      { where: { id: user.id } }
    );

    // Verify password was saved correctly by fetching fresh from DB
    logger.info(`[${requestId}] Verifying database update for user ${user.id}...`);
    const verifyUser = await User.findByPk(user.id);
    const verifyMatch = await bcrypt.compare(newPassword, verifyUser.password);
    
    if (!verifyMatch) {
      logger.error(`[${requestId}] DATABASE SYNC ERROR: Password mismatch after save for user ${user.id}`);
      return res.status(500).json({ error: "System failed to verify your new password. Please try again." });
    }

    logger.info(`[${requestId}] Password changed successfully for user ${user.id}`);
    res.json({ 
      message: "✓ Password changed successfully! Logging you out...",
      verified: true,
      action: "logout-and-relogin"
    });
  } catch (error) {
    logger.error(`[${requestId}] CRITICAL PASSWORD ERROR: ${error.message}`);
    res.status(500).json({ error: "A server error occurred while changing your password." });
  }
});

module.exports = router;
