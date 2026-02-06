# 🚨 Railway Build Failed - Quick Fix

## The Problem
Railway is trying to build from the root directory, but your backend code is in the `backend/` folder.

## ✅ Fix in 3 Steps

### Step 1: Open Railway Settings
1. Go to your Railway dashboard
2. Click on your project (the one showing "Build failed")
3. Click on the service (usually shows "Forex-Signal-website" or your repo name)
4. Click the **"Settings"** tab (top navigation)

### Step 2: Set Root Directory
1. Scroll down to find **"Root Directory"** section
2. You'll see it's probably empty or set to `.` (root)
3. Click in the input field
4. Type: `backend`
5. Click **"Save"** button

### Step 3: Redeploy
1. Railway will automatically start a new deployment
2. OR click the **"Redeploy"** button if you see it
3. Wait 1-2 minutes for the build to complete
4. Check the build status - it should show ✅ "Build succeeded"

---

## ⚠️ If Build Still Fails

### Check Environment Variables
Go to Settings → Variables and make sure you have at least:
- `PORT` = `5000`
- `MONGODB_URI` = your MongoDB connection string
- `JWT_SECRET` = any long random string (min 32 characters)
- `NODE_ENV` = `production`

### Check Build Logs
1. Go to "Deployments" tab
2. Click on the latest deployment
3. Click "View Logs"
4. Look for red error messages
5. Common errors:
   - **"Cannot find module"** → Missing dependency (check package.json)
   - **"ENOENT"** → Root directory still wrong
   - **"Port already in use"** → Check PORT variable

---

## 📋 After Build Succeeds

1. **Get Your Backend URL**:
   - Go to Settings → Domains
   - Copy the URL (e.g., `your-app.railway.app`)

2. **Test Backend**:
   - Open: `https://your-app.railway.app/api/health`
   - Should see: `{"status":"OK","message":"Server is running"}`

3. **Update Environment Variables**:
   - Add `BACKEND_URL` = `https://your-app.railway.app`
   - Add `FRONTEND_URL` = `https://your-frontend.vercel.app` (after deploying frontend)

---

## 🎯 That's It!

The most common fix is just setting the Root Directory to `backend`. Try that first!

For more detailed troubleshooting, see `RAILWAY_TROUBLESHOOTING.md`
