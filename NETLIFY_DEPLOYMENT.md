# 🚀 Netlify Deployment Guide

## Current Status: ✅ READY FOR DEPLOYMENT

Your project is configured for Netlify deployment with:
- Frontend: React + Vite (in `frontend-react/`)
- Backend: Express API (serverless via Netlify Functions)
- Database: Supabase PostgreSQL

---

## Step 1: Connect GitHub to Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **GitHub** (authorize if needed)
4. Select repository: **Richaaron/Resultsoftware**
5. Choose branch: **main**

---

## Step 2: Configure Build Settings

Netlify should auto-detect your `netlify.toml` config. Verify:

- **Build command:** `cd frontend-react && npm install --verbose && npx -y vite build && cd ..`
- **Publish directory:** `frontend-react/dist`
- **Functions directory:** `netlify/functions`

---

## Step 3: ⚠️ Add Environment Variables (CRITICAL)

1. In Netlify dashboard, go to **Site settings** → **Build & deploy** → **Environment**
2. Add these variables:

| Variable | Value | Where to Find |
|----------|-------|---|
| `DATABASE_URL` | Your Supabase connection string | Supabase Dashboard → Settings → Database → Connection Pooler |
| `JWT_SECRET` | Random 32+ char string (keep secure!) | Generate with: `openssl rand -base64 32` |
| `FRONTEND_URL` | `https://YOUR_NETLIFY_DOMAIN.netlify.app` | Will be your Netlify URL |

**Example DATABASE_URL:**
```
postgresql://postgres:YourPassword@db.hiwtaiwxqzcluftmgxeo.supabase.co:5432/postgres
```

3. Click **Save**

---

## Step 4: Deploy

1. Netlify will automatically trigger a build when you push to GitHub
2. Or manually click **"Deploy site"** in Netlify dashboard
3. Wait for build to complete (usually 2-5 minutes)

---

## Step 5: Test Your Deployment

Once deployed:

1. Visit your Netlify URL (e.g., `https://resultsoftware.netlify.app`)
2. Try logging in:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Check the API is working by visiting:
   - `https://YOUR_NETLIFY_DOMAIN/.netlify/functions/api/debug/users`

---

## URL Structure After Deployment

- **Frontend:** `https://YOUR_NETLIFY_DOMAIN.netlify.app/`
- **API Endpoints:** `https://YOUR_NETLIFY_DOMAIN.netlify.app/api/*`
  - Authentication: `/api/auth/login`, `/api/auth/register`
  - Students: `/api/students`
  - Results: `/api/results`
  - Attendance: `/api/attendance`
  - Teachers: `/api/teachers`
  - Settings: `/api/settings`

---

## 🔧 How It Works

1. Netlify builds the React frontend and publishes to `frontend-react/dist`
2. All requests to `/api/*` are routed to `netlify/functions/api`
3. The Express server handles all API requests using your Supabase database
4. Environment variables are securely managed in Netlify dashboard

---

## 🚨 Troubleshooting

### Build fails with "Cannot find module"
- Check `netlify.toml` build command
- Ensure all dependencies are in `package.json`

### "Cannot connect to database"
- Verify `DATABASE_URL` is set in Netlify environment variables
- Check connection string format (should start with `postgresql://`)

### API returns 404
- Check Netlify Functions are deployed (should see `netlify/functions/api` in build output)
- Verify redirects in `netlify.toml`

### CORS errors
- Check `FRONTEND_URL` is set correctly
- Verify CORS origins in `backend/server.js`

---

## Local Development

To test locally before deploying:

```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend-react
npm run dev
```

Visit: `http://localhost:5173`

---

## Next Steps

1. ✅ Push to GitHub (already done!)
2. ⏳ Connect GitHub to Netlify
3. ⏳ Add environment variables to Netlify
4. ⏳ Deploy and test
