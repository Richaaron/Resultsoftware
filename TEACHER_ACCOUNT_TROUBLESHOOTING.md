# Teacher Account - Troubleshooting & Prevention Guide

## Current Status: ✅ All Clear

Olumide Faluyi's account has passed all verification checks:
- ✅ Account active and ready
- ✅ Email configured for notifications
- ✅ Password hash valid
- ✅ Roles assigned correctly (Form Teacher + Subject Teacher)
- ✅ Class assignment: SSS 1
- ✅ Subject assignment: Mathematics
- ✅ No critical issues detected

---

## Potential Issues That Might Occur

### 1. **First Login Fails** ❌

#### Symptoms
- "Invalid username or password" error
- Teacher cannot access portal

#### Common Causes
| Cause | Solution |
|-------|----------|
| Wrong username typed | Check email for exact username: `olumidef21` |
| Temporary password expired | [See Password Reset](#password-reset-failed) |
| Account deactivated | Contact admin to reactivate |
| Database connection issue | Check backend server is running |
| Frontend/Backend mismatch | Ensure frontend points to correct API |

#### Prevention
- ✅ Verify credentials sent in email
- ✅ Test login immediately after creation
- ✅ Keep both frontend and backend servers running

#### Fix
```bash
# Test login directly
cd backend
node -e "
const { auth } = require('./middleware/auth');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const sequelize = require('./utils/db');

(async () => {
  await sequelize.authenticate();
  const user = await User.findOne({ where: { username: 'olumidef21' } });
  if (user) {
    const match = await bcrypt.compare('fvs@12345', user.password); // Replace with actual password
    console.log('Login test:', match ? 'PASS' : 'FAIL');
  }
  await sequelize.close();
})()
"
```

---

### 2. **Email Not Received** 📧❌

#### Symptoms
- Teacher never gets credentials email
- No way to verify temporary password

#### Common Causes
| Cause | Solution |
|-------|----------|
| Email provider timeout | Check email service logs |
| Wrong email address | Verify in database |
| Spam folder | Check spam/promotions folder |
| Email service not configured | Set EMAIL_USER and EMAIL_PASSWORD |
| Brevo fallback not working | Set BREVO_API_KEY |

#### Prevention
- ✅ Always verify email address before creating teacher
- ✅ Test email service before bulk creation
- ✅ Implement Brevo fallback

#### Fix - Resend Email
```bash
cd backend
node send-teacher-credentials.js "Olumide Faluyi"
```

#### Fix - Manual Email
Send to `olumidefaluyio@gmail.com`:
```
Subject: Your Result Management System Login Credentials

Dear Olumide Faluyi,

Your teacher account has been created. Here are your details:

Username: olumidef21
Temporary Password: [from original email or admin system]
Portal: https://resultsoftware.netlify.app/login

Roles: Form Teacher (SSS 1), Subject Teacher (Mathematics)

Please change your password on first login.

---
Result Management System
```

---

### 3. **Account Deactivation** 🔒

#### Symptoms
- "Your account has been deactivated" error on login
- Cannot access portal

#### Why It Happens
- Admin deactivated account
- Soft-delete applied
- System auto-deactivation (rare)

#### Fix
```bash
cd backend
node -e "
const User = require('./models/User');
const sequelize = require('./utils/db');

(async () => {
  await sequelize.authenticate();
  const teacher = await User.findOne({ where: { username: 'olumidef21' } });
  if (teacher) {
    teacher.isActive = true;
    await teacher.save();
    console.log('✓ Account reactivated');
  }
  await sequelize.close();
})()
"
```

---

### 4. **Password Reset Failed** 🔑❌

#### Symptoms
- Cannot change password
- "Current password is incorrect" even with right password
- Locked out of account

#### Common Causes
| Cause | Solution |
|-------|----------|
| Wrong current password | Verify exact password (case-sensitive) |
| Password validation error | New password must be 6+ chars, different from current |
| Passwords don't match | Confirm new password must equal new password field |
| Backend error | Check server logs |

#### Prevention
- ✅ Strong, unique password requirements
- ✅ Password confirmation field on UI
- ✅ Clear error messages

#### Fix - Admin Password Reset
```bash
cd backend
node -e "
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const sequelize = require('./utils/db');

(async () => {
  try {
    await sequelize.authenticate();
    const teacher = await User.findOne({ where: { username: 'olumidef21' } });
    
    if (teacher) {
      const newPassword = 'TempPassword123'; // Change this
      teacher.password = await bcrypt.hash(newPassword, 8);
      await teacher.save();
      console.log('✓ Password reset to: ' + newPassword);
      console.log('⚠ Share with teacher securely - they should change it immediately');
    }
    await sequelize.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
})()
"
```

---

### 5. **No Results/Attendance Permissions** ❌

#### Symptoms
- Teacher cannot post results
- Cannot mark attendance
- "Forbidden" or "Access Denied" errors

#### Common Causes
| Cause | Solution |
|-------|----------|
| Not assigned as Subject Teacher | Check `isSubjectTeacher = true` |
| Not assigned as Form Teacher | Check `isFormTeacher = true` |
| No subject assignment | Verify `assignedSubject` is set |
| No class assignment | Verify `assignedClass` is set |
| Role doesn't match portal | Ensure teacher logs into teacher portal |

#### Check Current Assignments
```bash
cd backend
node verify-teacher-account.js "Olumide Faluyi"
```

#### Fix - Add Permissions
```bash
cd backend
node -e "
const User = require('./models/User');
const sequelize = require('./utils/db');

(async () => {
  await sequelize.authenticate();
  const teacher = await User.findOne({ where: { username: 'olumidef21' } });
  
  if (teacher) {
    teacher.isFormTeacher = true;
    teacher.isSubjectTeacher = true;
    teacher.assignedClass = 'SSS 1';
    teacher.assignedSubject = 'Mathematics, English';
    await teacher.save();
    console.log('✓ Permissions updated');
  }
  await sequelize.close();
})()
"
```

---

### 6. **Session Expiration Issues** ⏰

#### Symptoms
- Logged out randomly
- "Please authenticate" error mid-session
- Token expired before 24 hours

#### Cause
- Token expires after 24 hours (by design)
- Logout button clicked
- Browser cache cleared
- Server restart

#### Prevention
- ✅ Let users know about 24-hour session limit
- ✅ Save work frequently
- ✅ Log back in when needed

#### Fix
Teachers just need to log back in:
1. Click logout
2. Log in again with username & password

---

### 7. **Activity Not Logging** 📝❌

#### Symptoms
- Admin dashboard shows no teacher activities
- No record of login/results entry/etc

#### Cause
- Activity logger disabled
- Database connection issue
- Teacher logged in during database outage

#### Prevention
- ✅ Ensure activity tracking enabled
- ✅ Monitor database health
- ✅ Check logs regularly

#### Check Activity Logging
```bash
cd backend
tail -f logs/combined.log | grep "olumidef21"
```

---

### 8. **Assignment Changes Not Reflecting** 🔄❌

#### Symptoms
- Changed class/subject but teacher still sees old assignments
- Frontend shows cached data

#### Cause
- Browser cache
- Old JWT token in localStorage
- API caching
- Database sync issue

#### Fix - Clear Cache
1. **Browser cache**: Ctrl+Shift+Delete (hard refresh)
2. **Clear localStorage**: Open DevTools → Application → Storage → Clear All
3. **Log out**: Click logout button
4. **Log back in**: Re-login to get fresh token

#### Fix - Force Refresh (Admin)
```bash
# Restart backend server
cd backend
npm run dev
```

---

## Monitoring Checklist

### Daily
- [ ] No login errors in logs
- [ ] Email delivery working
- [ ] Teachers accessing portal

### Weekly
- [ ] Activity logs show normal use
- [ ] No deactivated accounts
- [ ] Database backup successful

### Monthly
- [ ] Review all teacher permissions
- [ ] Check orphaned accounts
- [ ] Update any invalid emails

---

## Quick Reference: Common Commands

### Verify Account
```bash
node verify-teacher-account.js "Olumide Faluyi"
```

### Resend Email
```bash
node send-teacher-credentials.js "Olumide Faluyi"
```

### Check Login Credentials
```bash
node -e "
const User = require('./models/User');
const sequelize = require('./utils/db');
(async () => {
  await sequelize.authenticate();
  const teacher = await User.findOne({ where: { username: 'olumidef21' } });
  console.log(teacher ? '✓ User exists' : '✗ User not found');
  console.log('Active:', teacher?.isActive);
  await sequelize.close();
})()
"
```

### View Teacher Details
```bash
node verify-teacher-account.js "Olumide Faluyi"
```

### Reset Password (Admin Only)
```bash
# Contact backend admin or use admin panel
# See "Fix - Admin Password Reset" section above
```

---

## Success Indicators ✅

Everything is working correctly if:

1. ✅ Teacher receives login email
2. ✅ Teacher can log in with credentials
3. ✅ Dashboard loads without errors
4. ✅ Can see assigned class/subject
5. ✅ Can post results (if Subject Teacher)
6. ✅ Can mark attendance (if Form Teacher)
7. ✅ Activity shows in admin logs
8. ✅ Email notifications work

---

## Support & Escalation

### Level 1 - Teacher Self-Service
- Reset password
- Clear browser cache
- Log out and back in

### Level 2 - Admin
- Verify account using `verify-teacher-account.js`
- Resend credentials email
- Update permissions

### Level 3 - Developer
- Check backend logs
- Verify database connection
- Check email service status

---

## Prevention Best Practices

1. **Always verify new teachers**
   ```bash
   node verify-teacher-account.js "Teacher Name"
   ```

2. **Test first login immediately**
   - Create account
   - Send email
   - Have teacher log in within 1 hour

3. **Keep email service healthy**
   - Monitor email logs daily
   - Have Brevo fallback ready
   - Test monthly

4. **Regular backups**
   ```bash
   # Automated daily at 2 AM
   # See DATABASE backup configuration
   ```

5. **Monitor logs**
   ```bash
   # Follow real-time logs
   tail -f logs/combined.log
   
   # Search for errors
   grep "ERROR" logs/combined.log | tail -20
   ```

---

## Status: ✅ READY

Your system is configured correctly. The account for **Olumide Faluyi** has:
- ✅ Email delivered successfully
- ✅ All permissions configured
- ✅ No known issues
- ✅ Ready for first login

**No further issues expected** unless something changes in the system configuration.

