# Admin Login Troubleshooting Guide

## ✅ Correct Credentials

- **Username:** `admin`
- **Password:** `FolushoVictory2026`

---

## 🔴 Problem: "Invalid username or password" Error

### Quick Fixes (Try These First)

#### 1. **Clear Browser Cache** ⚡ (WORKS 80% OF THE TIME)
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select **All time**
3. Check both:
   - ☑️ Cookies and site data
   - ☑️ Cached images and files
4. Click "Clear data"
5. **Close browser completely** (all windows)
6. Reopen browser and try again with `admin` / `FolushoVictory2026`

**Why?** Browser caches old login tokens that prevent fresh login attempts.

---

#### 2. **Check CAPS LOCK**
- Is CAPS LOCK enabled?
- Password is case-sensitive: `FolushoVictory2026`
- Usernames are case-insensitive but try: `admin` (lowercase)

---

#### 3. **Try a Different Browser**
- Try Chrome, Firefox, Safari, or Edge
- This helps determine if it's a browser-specific issue

---

### If Quick Fixes Don't Work

#### 4. **Check if Backend is Running**

Your backend needs to seed the admin user. Run this verification script:

```bash
cd "Result Software"
node verify-admin-login.js
```

This script will:
- ✓ Test database connection
- ✓ Check if admin user exists
- ✓ Create admin user if missing
- ✓ Fix password if incorrect
- ✓ Reactivate account if deactivated

**Expected output:**
```
✓ VERIFICATION COMPLETE
LOGIN CREDENTIALS:
  Username: admin
  Password: FolushoVictory2026
```

---

#### 5. **If You Don't Have a Local Environment Set Up**

Your app is deployed to Netlify. The backend runs on Netlify Functions (serverless).

**First deployment only:** Admin user gets created automatically when backend first starts.

If admin still doesn't exist in database:

1. Go to **Netlify Dashboard**
2. Your site → **Functions** → **api** → **Logs**
3. Look for errors like "Database connection failed"

**If you see database errors:**
- Check your `DATABASE_URL` in Netlify environment variables
- Make sure it's a valid Supabase connection string

---

#### 6. **Manually Create Admin in Database (Advanced)**

If you have Supabase access:

1. Go to [Supabase Dashboard](https://supabase.com)
2. Open your project
3. Click **SQL Editor**
4. Paste this query:

```sql
-- Check if admin exists
SELECT * FROM "Users" WHERE username = 'admin' AND role = 'ADMIN';

-- If result is empty, create admin:
INSERT INTO "Users" (username, password, "fullName", role, "isFormTeacher", "isSubjectTeacher", "isActive")
VALUES ('admin', '$2a$08$...', 'System Administrator', 'ADMIN', false, true, true);
```

⚠️ **Note:** You need to replace `$2a$08$...` with a bcrypt hash of `FolushoVictory2026`.

To generate the hash locally:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('FolushoVictory2026', 8).then(h => console.log(h));"
```

---

## 🔍 Detailed Diagnosis

### Check 1: Is Frontend Connecting to Backend?

Open browser **DevTools** (F12) and go to **Network** tab:

1. Try to login
2. Look for a request to `/api/auth/login`
3. Click on it and check:
   - **Status:** Should be `401` (invalid credentials) or `200` (success)
   - If **404** or **Network Error:** Frontend can't reach backend
   - If **500:** Backend server error

### Check 2: Backend Server Status

Visit the health check endpoint:
```
https://folushovictoryschools.netlify.app/.netlify/functions/api/health
```

Expected response:
```json
{
  "status": "operational",
  "database": "connected",
  "timestamp": "2026-05-01T..."
}
```

If database shows `disconnected`:
- ❌ Backend can't connect to database
- ✅ Fix: Check `DATABASE_URL` environment variable in Netlify

### Check 3: Database Connection

Run a simple test (if you have local backend set up):
```bash
cd backend
node -e "
require('dotenv').config({ path: '.env.local' });
const sequelize = require('./utils/db');
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');
  } catch(e) {
    console.log('✗ Database error:', e.message);
  }
})()
"
```

---

## 📋 Solutions by Symptom

| Symptom | Solution |
|---------|----------|
| "Invalid username or password" (with correct credentials) | Clear browser cache, try different browser, run `verify-admin-login.js` |
| Login button doesn't respond | Check browser console (F12) for JavaScript errors |
| API returns 404 | Backend routes not deployed correctly, check Netlify Functions logs |
| API returns 500 | Backend error, check Netlify Function logs |
| Health check shows "database: disconnected" | Check DATABASE_URL environment variable in Netlify |
| Can't access Netlify logs | Check Netlify site permissions |

---

## 🆘 Still Not Working?

### 1. Collect Diagnostic Information

```bash
# Run verification script
node verify-admin-login.js

# Check if admin exists in database
cd backend
node list-admins.js

# Test login directly
node check_teacher.js
```

### 2. Check Netlify Logs

```bash
# Install Netlify CLI first (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# View function logs
netlify logs --functions
```

### 3. Check GitHub Actions Deployment

1. Go to GitHub → Your Repository → **Actions** tab
2. Look at the latest workflow run
3. If it shows ❌ (failed):
   - Click on the failed step
   - Read the error message
   - Most common: Missing environment variables

### 4. Force a New Deployment

```bash
git commit --allow-empty -m "Trigger redeployment"
git push origin main
```

Then wait for GitHub Actions to complete (usually 3-5 minutes).

---

## ✅ Verification Checklist

Before reporting an issue, verify:

- [ ] Browser cache cleared
- [ ] Using correct credentials: `admin` / `admin123`
- [ ] Tried different browser
- [ ] CAPS LOCK is off
- [ ] Ran `verify-admin-login.js` successfully
- [ ] Health check endpoint returns `status: operational`
- [ ] DATABASE_URL is set in Netlify environment
- [ ] No errors in Netlify Function logs
- [ ] No errors in GitHub Actions workflow

---

## 🚀 Quick Recovery Steps (If Everything Else Fails)

```bash
# 1. Navigate to project root
cd "Result Software"

# 2. Run the verification and fix script
node verify-admin-login.js

# 3. If using Netlify deployment, trigger rebuild
git commit --allow-empty -m "Reset deployment"
git push origin main

# 4. Wait for deployment to complete
# Watch: GitHub Actions → Workflows → Latest run

# 5. Try login again
# https://folushovictoryschools.netlify.app/login
# Username: admin
# Password: admin123
```

---

## 📚 Related Documentation

- [DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md) - Daily deployment workflow
- [ERROR_RECOVERY.md](ERROR_RECOVERY.md) - General error recovery guide
- [ENV_SETUP.md](ENV_SETUP.md) - Environment variables setup

---

## 📞 Still Need Help?

1. Check the [ERROR_RECOVERY.md](ERROR_RECOVERY.md) guide
2. Review [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for command reference
3. Check [FAILPROOF_DEPLOYMENT.md](FAILPROOF_DEPLOYMENT.md) for deployment details
