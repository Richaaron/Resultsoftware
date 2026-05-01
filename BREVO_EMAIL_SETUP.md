# Email Service Setup Guide

## Current Status

Your Result Management System has been enhanced with **dual email providers** for reliability:

### Primary: Gmail SMTP (with IPv4-only fix)
- **Status:** Currently configured
- **Provider:** `folushovictoryschool@gmail.com`
- **Fix Applied:** IPv4-only connection to avoid IPv6 timeout issues

### Fallback: Brevo (formerly Sendinblue)
- **Status:** Optional but recommended
- **Reliability:** ⭐⭐⭐⭐⭐ (Free tier includes 300 emails/day)
- **Setup Time:** 2 minutes

---

## Option 1: Gmail SMTP (Current)

### Configuration
```env
EMAIL_USER=folushovictoryschool@gmail.com
EMAIL_PASSWORD=engq mfvx bpdb tiip
```

### Changes Applied
✅ IPv4-only connection to prevent IPv6 timeouts
✅ Connection timeout: 5 seconds
✅ Auto-retry with Brevo fallback

### Test Email
```bash
cd backend
node send-teacher-credentials.js "Olumide Faluyi"
```

---

## Option 2: Brevo Fallback (Recommended for Reliability)

### Why Brevo?
- 100% uptime guarantee
- 300 free emails/day (more than enough for a school)
- No complex authentication
- Automatic rate limiting
- Better deliverability

### Setup Steps

#### Step 1: Create Free Brevo Account
1. Go to https://www.brevo.com/
2. Click **Sign up for free**
3. Enter your email and school name
4. Complete email verification

#### Step 2: Get API Key
1. After login, go to **Settings** → **API & Webhooks**
2. Click **Create a new API key**
3. Name it: `Result Management System`
4. Select scopes: `Email`
5. Copy the API key

#### Step 3: Update Environment
Add to your `.env` or `.env.local` file:

```env
# Existing Gmail config (keeps working as primary)
EMAIL_USER=folushovictoryschool@gmail.com
EMAIL_PASSWORD=engq mfvx bpdb tiip

# New Brevo fallback
BREVO_API_KEY=your_api_key_here
EMAIL_FROM_NAME=Result Management System
```

#### Step 4: Test Brevo
```bash
cd backend

# Set Brevo API key temporarily for testing
$env:BREVO_API_KEY="your_api_key_here"

# Send test email
node send-teacher-credentials.js "Olumide Faluyi"
```

---

## How It Works

### Email Sending Flow
```
1. Attempt to send via Gmail SMTP (IPv4-only)
   ├─ Success? → Email sent ✓
   └─ Failure? → Try Brevo fallback
2. Attempt to send via Brevo API
   ├─ Success? → Email sent ✓
   └─ Failure? → Log error
```

### Logging
Check logs to see which service was used:

```bash
# Gmail success
Email sent via Gmail to teacher@email.com: messageId

# Brevo fallback
Gmail delivery failed, attempting Brevo fallback...
Email sent via Brevo to teacher@email.com: messageId
```

---

## Common Issues & Solutions

### Gmail Still Timing Out?
**Solution:** The IPv4-only fix should resolve this. If not:
1. Check firewall allows port 587 to smtp.gmail.com
2. Verify app password (not regular password)
3. Use Brevo instead (recommended)

### Brevo API Key Not Working?
1. Verify API key is copied correctly (no spaces)
2. Ensure API key has `Email` scope enabled
3. Check rate limit (300/day free tier)

### Testing Email Delivery
```bash
# Test Gmail
node -e "const { sendEmail } = require('./utils/emailService'); sendEmail('your-email@gmail.com', 'Test', '<p>Works!</p>')"

# Check logs for success/failure
tail -f logs/combined.log
```

---

## Production Recommendations

1. **Use Brevo as primary** for better reliability
   ```env
   # Set Brevo as primary
   BREVO_API_KEY=your_api_key_here
   # Gmail becomes optional fallback
   ```

2. **Monitor email delivery** in admin dashboard
3. **Set email alerts** for delivery failures
4. **Test quarterly** to ensure service works

---

## Next Steps

1. ✅ Gmail IPv4 fix is **already applied**
2. 👉 **[Optional]** Set up Brevo for automatic fallback (2 minutes)
3. Test by running: `node send-teacher-credentials.js "Olumide Faluyi"`

---

## Support

For issues, check:
- Logs: `backend/logs/combined.log`
- .env configuration: `backend/.env.local`
- Email provider status:
  - Gmail: https://www.google.com/apppasswords
  - Brevo: https://app.brevo.com/settings/smtp

