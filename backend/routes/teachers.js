const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { auth, authorize } = require("../middleware/auth");
const User = require("../models/User");
const { sendTeacherWelcomeEmail } = require("../utils/emailService");
const logger = require("../utils/logger");

// Register a new teacher (Admin only)
router.post("/register", auth, authorize(["ADMIN"]), async (req, res) => {
  try {
    const {
      fullName,
      email,
      isFormTeacher,
      isSubjectTeacher,
      assignedClass,
      assignedSubject,
      profileImage,
    } = req.body;

    // Handle multiple subjects if provided as array
    const formattedSubject = Array.isArray(assignedSubject)
      ? assignedSubject.join(", ")
      : assignedSubject;

    // Generate short, simple username
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0].toLowerCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toLowerCase();
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const username = `${firstName}${lastInitial}${randomSuffix}`;

    // Generate password with fvs@ prefix + random numbers
    const randomNumbers = Math.floor(10000 + Math.random() * 90000);
    const password = `fvs@${randomNumbers}`;
    const hashedPassword = await bcrypt.hash(password, 8);

    const teacher = await User.create({
      username,
      password: hashedPassword,
      fullName,
      email: email || null,
      role: "TEACHER",
      isFormTeacher: !!isFormTeacher,
      isSubjectTeacher: !!isSubjectTeacher,
      assignedClass,
      assignedSubject: formattedSubject,
      profileImage,
    });

    // Send welcome email if email is provided and notifications are enabled
    let emailStatus = {
      sent: false,
      message: '',
    };

    if (email) {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        try {
          await sendTeacherWelcomeEmail(email, {
            fullName,
            username,
            password,
            isFormTeacher,
            isSubjectTeacher,
            assignedClass,
            assignedSubject: formattedSubject,
          });
          logger.info(`Welcome email sent to teacher: ${email}`);
          emailStatus = {
            sent: true,
            message: `Welcome email with login credentials and assignment details sent to ${email}`,
          };
        } catch (emailError) {
          logger.error(`Failed to send welcome email to ${email}: ${emailError.message}`);
          emailStatus = {
            sent: false,
            message: `Failed to send email: ${emailError.message}`,
          };
          // Don't fail the registration if email fails
        }
      } else {
        logger.warn('Email notifications not configured. Set EMAIL_USER and EMAIL_PASSWORD environment variables.');
        emailStatus = {
          sent: false,
          message: 'Email notifications are not configured on the server',
        };
      }
    } else {
      emailStatus = {
        sent: false,
        message: 'No email address provided for teacher',
      };
    }

    res.status(201).send({
      teacher: {
        id: teacher.id,
        username: teacher.username,
        fullName: teacher.fullName,
        email: teacher.email,
        role: teacher.role,
        isFormTeacher: teacher.isFormTeacher,
        isSubjectTeacher: teacher.isSubjectTeacher,
        assignedClass: teacher.assignedClass,
        assignedSubject: teacher.assignedSubject,
      },
      credentials: {
        username,
        password,
      },
      emailStatus,
    });
  } catch (error) {
    console.error("Teacher registration error:", error);
    res.status(400).send({ error: "Failed to register teacher" });
  }
});

// Get all active teachers (Admin only)
router.get("/", auth, authorize(["ADMIN"]), async (req, res) => {
  try {
    const teachers = await User.findAll({
      where: { role: "TEACHER", isActive: true },
      attributes: [
        "id",
        "username",
        "fullName",
        "email",
        "isFormTeacher",
        "isSubjectTeacher",
        "assignedClass",
        "assignedSubject",
        "createdAt",
      ],
    });
    res.send(teachers);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch teachers" });
  }
});

// Get inactive/archived teachers (Admin only)
router.get("/archived/list", auth, authorize(["ADMIN"]), async (req, res) => {
  try {
    const inactiveTeachers = await User.findAll({
      where: { role: "TEACHER", isActive: false },
      attributes: [
        "id",
        "username",
        "fullName",
        "email",
        "isFormTeacher",
        "isSubjectTeacher",
        "assignedClass",
        "assignedSubject",
        "createdAt",
        "updatedAt",
      ],
    });
    res.send(inactiveTeachers);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch archived teachers" });
  }
});

// Update teacher profile image (Self) — MUST be above PATCH /:id to avoid being swallowed
router.patch("/profile", auth, authorize(["TEACHER"]), async (req, res) => {
  try {
    const { profileImage } = req.body;
    const teacher = await User.findByPk(req.user.id);

    if (!teacher) {
      return res.status(404).send({ error: "Teacher not found" });
    }

    teacher.profileImage = profileImage;
    await teacher.save();

    res.send({ profileImage: teacher.profileImage });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(400).send({ error: "Failed to update profile" });
  }
});

// Update a teacher (Admin only)
router.patch("/:id", auth, authorize(["ADMIN"]), async (req, res) => {
  try {
    const {
      fullName,
      email,
      isFormTeacher,
      isSubjectTeacher,
      assignedClass,
      assignedSubject,
      profileImage,
    } = req.body;
    const teacher = await User.findOne({
      where: { id: req.params.id, role: "TEACHER" },
    });

    if (!teacher) {
      return res.status(404).send({ error: "Teacher not found" });
    }

    if (fullName !== undefined) teacher.fullName = fullName;
    if (email !== undefined) teacher.email = email;
    if (isFormTeacher !== undefined) teacher.isFormTeacher = isFormTeacher;
    if (isSubjectTeacher !== undefined)
      teacher.isSubjectTeacher = isSubjectTeacher;
    if (assignedClass !== undefined) teacher.assignedClass = assignedClass;
    if (profileImage !== undefined) teacher.profileImage = profileImage;

    if (assignedSubject !== undefined) {
      teacher.assignedSubject = Array.isArray(assignedSubject)
        ? assignedSubject.join(", ")
        : assignedSubject;
    }

    await teacher.save();

    res.send({
      id: teacher.id,
      username: teacher.username,
      fullName: teacher.fullName,
      email: teacher.email,
      role: teacher.role,
      isFormTeacher: teacher.isFormTeacher,
      isSubjectTeacher: teacher.isSubjectTeacher,
      assignedClass: teacher.assignedClass,
      assignedSubject: teacher.assignedSubject,
      profileImage: teacher.profileImage,
    });
  } catch (error) {
    res.status(400).send({ error: "Failed to update teacher" });
  }
});

// Deactivate a teacher (Admin only) - Soft delete
router.delete("/:id", auth, authorize(["ADMIN"]), async (req, res) => {
  try {
    const teacher = await User.findOne({
      where: { id: req.params.id, role: "TEACHER" },
    });

    if (!teacher) {
      return res.status(404).send({ error: "Teacher not found" });
    }

    if (!teacher.isActive) {
      return res.status(400).send({ error: "Teacher is already deactivated" });
    }

    teacher.isActive = false;
    await teacher.save();
    logger.info(`Teacher ${teacher.fullName} (ID: ${teacher.id}) has been deactivated`);
    res.send({ 
      message: "Teacher deactivated successfully",
      teacher: {
        id: teacher.id,
        fullName: teacher.fullName,
        email: teacher.email,
        isActive: teacher.isActive,
      }
    });
  } catch (error) {
    logger.error(`Failed to deactivate teacher: ${error.message}`);
    res.status(500).send({ error: "Failed to deactivate teacher" });
  }
});

// Reactivate a teacher (Admin only)
router.post("/:id/reactivate", auth, authorize(["ADMIN"]), async (req, res) => {
  try {
    const teacher = await User.findOne({
      where: { id: req.params.id, role: "TEACHER" },
    });

    if (!teacher) {
      return res.status(404).send({ error: "Teacher not found" });
    }

    if (teacher.isActive) {
      return res.status(400).send({ error: "Teacher is already active" });
    }

    teacher.isActive = true;
    await teacher.save();
    logger.info(`Teacher ${teacher.fullName} (ID: ${teacher.id}) has been reactivated`);
    res.send({ 
      message: "Teacher reactivated successfully",
      teacher: {
        id: teacher.id,
        fullName: teacher.fullName,
        email: teacher.email,
        isActive: teacher.isActive,
      }
    });
  } catch (error) {
    logger.error(`Failed to reactivate teacher: ${error.message}`);
    res.status(500).send({ error: "Failed to reactivate teacher" });
  }
});

module.exports = router;
