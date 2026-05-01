const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send email with template
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Plain text content (optional)
 */
async function sendEmail(to, subject, html, text = null) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text fallback
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email to new user
 */
async function sendWelcomeEmail(to, userName, tempPassword, username) {
  const subject = 'Welcome to Result Management System - Your Login Credentials';
  const portalUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const loginUrl = `${portalUrl}/login`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Result Management System</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>Your account has been created successfully. You can now log in using your credentials:</p>
      
      <div style="background-color: #f0f0f0; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${loginUrl}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          Access Portal
        </a>
      </div>
      
      <p style="color: #d32f2f;"><strong>Important:</strong> Please change your password immediately after logging in.</p>
      
      <p>If you have any questions, please contact the school administration.</p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  return sendEmail(to, subject, html);
}

/**
 * Send results posted notification to student/parent
 */
async function sendResultsNotification(to, userName, className, resultsLink) {
  const subject = 'New Results Posted - Result Management System';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2196F3;">Results Posted</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>New results have been posted for <strong>${className}</strong>.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resultsLink}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Results
        </a>
      </div>
      
      <p>Log in to the Result Management System to view detailed results and performance analysis.</p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  return sendEmail(to, subject, html);
}

/**
 * Send attendance alert to parent
 */
async function sendAttendanceAlert(to, studentName, attendancePercentage, className) {
  const subject = 'Attendance Alert - Result Management System';
  const alertLevel = attendancePercentage < 75 ? 'critical' : 'warning';
  const color = attendancePercentage < 75 ? '#d32f2f' : '#f57c00';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${color};">Attendance Alert</h2>
      <p>Dear Parent/Guardian,</p>
      <p>This is to inform you that <strong>${studentName}</strong>'s attendance in <strong>${className}</strong> requires attention.</p>
      
      <div style="background-color: #f0f0f0; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid ${color};">
        <p><strong>Current Attendance:</strong> ${attendancePercentage.toFixed(2)}%</p>
        <p style="color: ${color}; font-weight: bold;">Status: ${alertLevel === 'critical' ? 'CRITICAL' : 'WARNING'}</p>
      </div>
      
      <p>Please ensure regular attendance to avoid any academic impact. For more details, log in to the Result Management System.</p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  return sendEmail(to, subject, html);
}

/**
 * Send password reset link
 */
async function sendPasswordResetEmail(to, userName, resetLink) {
  const subject = 'Password Reset - Result Management System';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      
      <p style="color: #666; font-size: 12px;">This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  return sendEmail(to, subject, html);
}

/**
 * Send test email to verify configuration
 */
async function sendTestEmail(to) {
  const subject = 'Test Email - Result Management System';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Test Email Successful ✓</h2>
      <p>This is a test email to verify that email notifications are configured correctly.</p>
      <p style="color: #666;">You can now receive email notifications from the Result Management System.</p>
    </div>
  `;

  return sendEmail(to, subject, html);
}

/**
 * Send activity notification to admin
 */
async function sendActivityNotificationEmail(to, teacherId, activity) {
  const User = require("../models/User");
  const teacher = await User.findByPk(teacherId);
  
  const severityColors = {
    LOW: "#4CAF50",
    MEDIUM: "#FF9800",
    HIGH: "#F44336",
    CRITICAL: "#8B0000",
  };

  const subject = `[${activity.severity}] Teacher Activity Alert - ${teacher?.fullName || `ID: ${teacherId}`}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${severityColors[activity.severity]};">⚠️ Teacher Activity Alert</h2>
      
      <div style="background-color: #f0f0f0; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid ${severityColors[activity.severity]};">
        <p><strong>Teacher:</strong> ${teacher?.fullName || `ID: ${teacherId}`}</p>
        <p><strong>Activity Type:</strong> ${activity.activityType}</p>
        <p><strong>Severity:</strong> <span style="color: ${severityColors[activity.severity]}; font-weight: bold;">${activity.severity}</span></p>
        <p><strong>Time:</strong> ${new Date(activity.createdAt).toLocaleString()}</p>
        <p><strong>IP Address:</strong> ${activity.ipAddress || 'Unknown'}</p>
        ${activity.affectedResource ? `<p><strong>Affected Resource:</strong> ${activity.affectedResource}</p>` : ''}
        ${activity.description ? `<p><strong>Description:</strong> ${activity.description}</p>` : ''}
      </div>

      <p style="color: #666; font-size: 14px;">
        <strong>Note:</strong> This is an automated alert. Please review the activity in the admin dashboard for more details.
      </p>
    </div>
  `;

  return sendEmail(to, subject, html);
}

/**
 * Send comprehensive welcome email to new teacher with assignment details
 */
async function sendTeacherWelcomeEmail(to, teacherDetails) {
  const { fullName, username, password, isFormTeacher, isSubjectTeacher, assignedClass, assignedSubject } = teacherDetails;
  const subject = 'Welcome to Result Management System - Teacher Account Created';
  const portalUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const loginUrl = `${portalUrl}/login`;
  
  // Build assignment info
  let assignmentInfo = '<p><strong>Role:</strong> ';
  const roles = [];
  if (isFormTeacher) roles.push('Form Teacher');
  if (isSubjectTeacher) roles.push('Subject Teacher');
  assignmentInfo += (roles.length > 0 ? roles.join(', ') : 'Teacher') + '</p>';
  
  if (assignedClass) {
    assignmentInfo += `<p><strong>Assigned Class:</strong> ${assignedClass}</p>`;
  }
  if (assignedSubject) {
    assignmentInfo += `<p><strong>Assigned Subject(s):</strong> ${assignedSubject}</p>`;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2196F3; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center;">
        <h1 style="margin: 0;">Result Management System</h1>
        <p style="margin: 5px 0 0 0;">Teacher Account Created</p>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <p>Dear <strong>${fullName}</strong>,</p>
        
        <p>Your teacher account has been successfully created in the Result Management System. You can now log in and manage student results, attendance, and class information.</p>
        
        <div style="background-color: white; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #2196F3;">
          <h3 style="margin-top: 0; color: #333;">Your Login Credentials</h3>
          <p><strong>Username:</strong> <code style="background-color: #f0f0f0; padding: 5px 10px; border-radius: 3px; font-family: monospace;">${username}</code></p>
          <p><strong>Temporary Password:</strong> <code style="background-color: #f0f0f0; padding: 5px 10px; border-radius: 3px; font-family: monospace;">${password}</code></p>
        </div>
        
        <div style="background-color: white; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #333;">Your Assignment Details</h3>
          ${assignmentInfo}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Log In to Your Account
          </a>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h4 style="margin-top: 0; color: #856404;">Important: Security Notice</h4>
          <ul style="margin: 10px 0; padding-left: 20px; color: #856404;">
            <li>Please change your temporary password immediately after logging in</li>
            <li>Use a strong password with uppercase, lowercase, numbers, and special characters</li>
            <li>Never share your login credentials with anyone</li>
            <li>Log out properly when you finish using the system</li>
          </ul>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #1976d2;">Getting Started</h4>
          <p style="margin: 10px 0; color: #333;">
            Once logged in, you can:
          </p>
          <ul style="margin: 10px 0; padding-left: 20px; color: #333;">
            <li>View and manage student results</li>
            <li>Track attendance records</li>
            <li>Send messages to parents</li>
            <li>Update student information</li>
            <li>Generate performance reports</li>
          </ul>
        </div>
        
        <p style="color: #666; margin-top: 30px;">If you experience any issues logging in or have questions about the system, please contact the school administration.</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email. Please do not reply to this message.</p>
      </div>
    </div>
  `;

  return sendEmail(to, subject, html);
}

/**
 * Send teacher activity summary to admin for tracking/audit
 */
async function sendTeacherActivitySummaryEmail(to, teacherId, activity) {
  const User = require("../models/User");
  const teacher = await User.findByPk(teacherId);
  
  const activityTypeLabels = {
    LOGIN: "🔓 Login",
    LOGOUT: "🔐 Logout",
    CREATE_RESULT: "➕ Created Result",
    UPDATE_RESULT: "✏️ Updated Result",
    DELETE_RESULT: "🗑️ Deleted Result",
    CREATE_ATTENDANCE: "➕ Created Attendance",
    UPDATE_ATTENDANCE: "✏️ Updated Attendance",
    DELETE_ATTENDANCE: "🗑️ Deleted Attendance",
    ACCESS_STUDENT_DATA: "👁️ Accessed Student Data",
    EXPORT_DATA: "📤 Exported Data",
    CHANGE_PASSWORD: "🔑 Changed Password",
    PROFILE_UPDATE: "👤 Updated Profile",
    OTHER: "📝 Other Activity",
  };

  const severityColors = {
    LOW: "#4CAF50",
    MEDIUM: "#FF9800",
    HIGH: "#F44336",
    CRITICAL: "#8B0000",
  };

  const subject = `Teacher Activity Log - ${teacher?.fullName || `ID: ${teacherId}`} - ${activityTypeLabels[activity.activityType] || activity.activityType}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2196F3; color: white; padding: 15px; border-radius: 5px 5px 0 0; text-align: center;">
        <h2 style="margin: 0;">📊 Teacher Activity Tracked</h2>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid ${severityColors[activity.severity]};">
          <p style="margin: 5px 0;"><strong>Teacher:</strong> ${teacher?.fullName || `ID: ${teacherId}`}</p>
          <p style="margin: 5px 0;"><strong>Activity:</strong> ${activityTypeLabels[activity.activityType] || activity.activityType}</p>
          <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${new Date(activity.createdAt).toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          })}</p>
          <p style="margin: 5px 0;"><strong>Severity:</strong> <span style="color: ${severityColors[activity.severity]}; font-weight: bold;">${activity.severity}</span></p>
          <p style="margin: 5px 0;"><strong>IP Address:</strong> ${activity.ipAddress || 'Unknown'}</p>
          ${activity.affectedResource ? `<p style="margin: 5px 0;"><strong>Resource:</strong> ${activity.affectedResource}</p>` : ''}
          ${activity.description ? `<p style="margin: 5px 0;"><strong>Details:</strong> ${activity.description}</p>` : ''}
        </div>

        <div style="background-color: #e3f2fd; padding: 12px; border-radius: 5px; margin: 15px 0; font-size: 13px;">
          <p style="margin: 5px 0; color: #555;">
            <strong>📋 Note:</strong> This is an automated audit log entry. All teacher activities are tracked for compliance and security purposes.
          </p>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">
          Sent automatically by Result Management System
        </p>
      </div>
    </div>
  `;

  return sendEmail(to, subject, html);
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendTeacherWelcomeEmail,
  sendResultsNotification,
  sendAttendanceAlert,
  sendPasswordResetEmail,
  sendTestEmail,
  sendActivityNotificationEmail,
  sendTeacherActivitySummaryEmail,
};
