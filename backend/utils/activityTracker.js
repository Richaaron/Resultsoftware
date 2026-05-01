const ActivityLog = require("../models/ActivityLog");
const { sendActivityNotificationEmail, sendTeacherActivitySummaryEmail } = require("./emailService");
const logger = require("./logger");

const ADMIN_EMAIL = "folushovictoryschool@gmail.com";

/**
 * Log teacher activity and send email to admin for all teacher activities
 */
async function logActivity(teacherId, activityType, description, req, affectedResource = null, severity = "LOW") {
  try {
    const ipAddress = req?.ip || req?.connection?.remoteAddress || "Unknown";
    const userAgent = req?.headers?.["user-agent"] || "Unknown";

    const activity = await ActivityLog.create({
      teacherId,
      activityType,
      description,
      ipAddress,
      userAgent,
      affectedResource,
      severity,
    });

    // Send email notification for HIGH/CRITICAL activities immediately
    if (["HIGH", "CRITICAL"].includes(severity) && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        await sendActivityNotificationEmail(ADMIN_EMAIL, teacherId, activity);
        await activity.update({ emailSent: true });
        logger.info(`High-severity activity alert email sent for activity ID: ${activity.id}`);
      } catch (emailError) {
        logger.warn(`Failed to send activity alert email: ${emailError.message}`);
      }
    }
    // Send email for all other teacher activities (for tracking/audit)
    else if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        await sendTeacherActivitySummaryEmail(ADMIN_EMAIL, teacherId, activity);
        await activity.update({ emailSent: true });
        logger.info(`Activity tracking email sent for activity ID: ${activity.id}`);
      } catch (emailError) {
        logger.warn(`Failed to send activity tracking email: ${emailError.message}`);
      }
    }

    return activity;
  } catch (error) {
    logger.error(`Failed to log activity: ${error.message}`);
    throw error;
  }
}

/**
 * Get activity logs for a teacher (admin only)
 */
async function getTeacherActivityLogs(teacherId, options = {}) {
  try {
    const { limit = 100, offset = 0, startDate = null, endDate = null, activityType = null } = options;
    const where = { teacherId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[require("sequelize").Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[require("sequelize").Op.lte] = new Date(endDate);
    }

    if (activityType) where.activityType = activityType;

    const activities = await ActivityLog.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return activities;
  } catch (error) {
    logger.error(`Failed to retrieve activity logs: ${error.message}`);
    throw error;
  }
}

/**
 * Get activity summary for admin dashboard
 */
async function getActivitySummary(days = 7) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const summaryByType = await ActivityLog.findAll({
      where: {
        createdAt: {
          [require("sequelize").Op.gte]: startDate,
        },
      },
      attributes: [
        "activityType",
        [require("sequelize").fn("COUNT", require("sequelize").col("id")), "count"],
      ],
      group: ["activityType"],
      raw: true,
    });

    const summaryBySeverity = await ActivityLog.findAll({
      where: {
        createdAt: {
          [require("sequelize").Op.gte]: startDate,
        },
      },
      attributes: [
        "severity",
        [require("sequelize").fn("COUNT", require("sequelize").col("id")), "count"],
      ],
      group: ["severity"],
      raw: true,
    });

    return { summaryByType, summaryBySeverity };
  } catch (error) {
    logger.error(`Failed to get activity summary: ${error.message}`);
    throw error;
  }
}

module.exports = {
  logActivity,
  getTeacherActivityLogs,
  getActivitySummary,
};
