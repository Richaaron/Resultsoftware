const express = require("express");
const router = express.Router();
const Setting = require("../models/Setting");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
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
      headTeacherName: settings.headTeacherName,
      headTeacherSignature: settings.headTeacherSignature,
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

module.exports = router;
