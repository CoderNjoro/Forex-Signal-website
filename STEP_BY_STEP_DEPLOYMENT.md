# Step-by-Step Deployment Guide

This guide will walk you through every step of deploying your website.

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Railway/Render account (free)
- [ ] MongoDB Atlas account (free)

---

## Part 1: Setting Up MongoDB Atlas (Cloud Database)

Since you can't use local MongoDB in production, we'll use MongoDB Atlas (free).

### Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Sign up with your email (or use Google/GitHub)
4. Verify your email

### Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **"M0 FREE"** (Free tier)
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to you
5. Click **"Create"**
6. Wait 1-3 minutes for cluster to be created

### Step 3: Create Database User

1. In the setup, you'll see "Create Database User"
2. Choose **"Password"** authentication
3. Enter a username (e.g., `forexuser`)
4. Click **"Autogenerate Secure Password"** or create your own
5. **IMPORTANT**: Copy and save this password! You'll need it.
6. Click **"Create Database User"**

### Step 4: Set Network Access (Whitelist IP)

1. In the setup, you'll see "Network Access"
2. Click **"Add My Current IP Address"**
3. For production, also click **"Add IP Address"**
4. Enter: `0.0.0.0/0` (allows all IPs - needed for hosting)
5. Click **"Add"**
6. Click **"Finish and Close"**

### Step 5: Get Connection String

1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Select **"Node.js"** and version **"5.5 or later"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace** `<username>` with your database username
6. **Replace** `<password>` with your database password
7. **Add database name** at the end: `?retryWrites=true&w=majority` → `forex-signals?retryWrites=true&w=majority`
8. Final string should look like:
   ```
   mongodb+srv://forexuser:yourpassword@cluster0.xxxxx.mongodb.net/forex-signals?retryWrites=true&w=majority
   ```
9. **Save this connection string** - you'll need it for backend!

---

## Part 2: Deploy Backend to Railway

### Step 1: Create Railway Account

1. Go to [https://railway.app](https://railway.app)
2. Click **"Start a New Project"** or **"Login"**
3. Sign up with GitHub (recommended)

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub
4. Select your repository (`ffsignal`)
5. Railway will start deploying

### Step 3: Configure Project Settings

1. Click on your project
2. Click on the service (it will be named after your repo)
3. Click **"Settings"** tab
4. Scroll to **"Root Directory"**
5. Set to: `backend`
6. Click **"Save"**

### Step 4: Set Environment Variables

1. Still in Settings, scroll to **"Variables"** section
2. Click **"New Variable"** for each one:

   **Variable 1:**
   - Name: `PORT`
   - Value: `5000`
   - Click **"Add"**

   **Variable 2:**
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://forexuser:yourpassword@cluster0.xxxxx.mongodb.net/forex-signals?retryWrites=true&w=majority`
   - ⚠️ **Use your actual MongoDB connection string from Part 1!**
   - Click **"Add"**

   **Variable 3:**
   - Name: `JWT_SECRET`
   - Value: `your-super-secret-key-min-32-characters-long-change-this`
   - ⚠️ **Use a long random string!**
   - Click **"Add"**

   **Variable 4:**
   - Name: `JWT_EXPIRE`
   - Value: `7d`
   - Click **"Add"**

   **Variable 5:**
   - Name: `NODE_ENV`
   - Value: `production`
   - Click **"Add"**

   **Variable 6:**
   - Name: `FRONTEND_URL`
   - Value: `https://your-vercel-app.vercel.app`
   - ⚠️ **We'll update this after deploying frontend!**
   - Click **"Add"**

   **Variable 7:**
   - Name: `BACKEND_URL`
   - Value: `https://your-backend.railway.app`
   - ⚠️ **We'll get this URL after deployment!**
   - Click **"Add"**

### Step 5: Get Your Backend URL

1. Go to **"Settings"** tab
2. Scroll to **"Domains"** section
3. Railway will show a URL like: `your-app.railway.app`
4. **Copy this URL** - this is your backend URL!
5. Update the `BACKEND_URL` variable with this URL
6. Click **"Redeploy"** button

### Step 6: Verify Backend is Running

1. Go to **"Deployments"** tab
2. Wait for deployment to finish (green checkmark)
3. Click on the deployment
4. Check logs - should see: "Server running in production mode on port 5000"
5. Test: Open `https://your-backend.railway.app/api/health` in browser
6. Should see: `{"status":"OK","message":"Server is running"}`

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)

### Step 2: Import Project

1. Click **"Add New Project"** or **"Import Project"**
2. Select your GitHub repository (`ffsignal`)
3. Click **"Import"**

### Step 3: Configure Project

1. **Framework Preset**: Select **"Vite"** (or it auto-detects)
2. **Root Directory**: Click **"Edit"** and set to `frontend`
3. **Build Command**: `npm run build` (auto-filled)
4. **Output Directory**: `dist` (auto-filled)
5. **Install Command**: `npm install` (auto-filled)

### Step 4: Set Environment Variables

1. Scroll down to **"Environment Variables"** section
2. Click **"Add"** button
3. Enter:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend.railway.app/api`
   - ⚠️ **Use your actual Railway backend URL from Part 2!**
4. Make sure **"Production"**, **"Preview"**, and **"Development"** are all checked
5. Click **"Add"**

### Step 5: Deploy

1. Click **"Deploy"** button
2. Wait 1-2 minutes for build to complete
3. You'll see: **"Congratulations! Your project has been deployed."**
4. **Copy your Vercel URL** (e.g., `your-app.vercel.app`)

### Step 6: Update Backend with Frontend URL

1. Go back to Railway
2. Go to your backend project → Settings → Variables
3. Find `FRONTEND_URL` variable
4. Click **"Edit"** (pencil icon)
5. Update value to: `https://your-vercel-app.vercel.app`
6. Click **"Save"**
7. Railway will automatically redeploy

---

## Part 4: Final Testing

### Test 1: Backend Health Check

1. Open: `https://your-backend.railway.app/api/health`
2. Should see: `{"status":"OK","message":"Server is running"}`

### Test 2: Frontend Loads

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Should see your website homepage

### Test 3: Check Console

1. Open your Vercel URL
2. Press `F12` to open DevTools
3. Go to **"Console"** tab
4. Should see NO errors about localhost
5. Should see: "Connected to server" (if logged in)

### Test 4: Register User

1. Click **"Register"** on your website
2. Fill in the form
3. Click **"Register"**
4. Should work without errors!

### Test 5: Check Network Tab

1. In DevTools, go to **"Network"** tab
2. Try registering/login
3. Check API calls - should go to your Railway URL (not localhost)

---

## 🐛 Troubleshooting

### Backend not starting?

1. Check Railway logs (Deployments → View Logs)
2. Verify all environment variables are set
3. Check MongoDB connection string is correct
4. Make sure database name is in connection string

### Frontend showing errors?

1. Check Vercel build logs
2. Verify `VITE_API_URL` is set correctly
3. Make sure it includes `/api` at the end
4. Clear browser cache (Ctrl+Shift+R)

### Can't connect to database?

1. Check MongoDB Atlas network access (should allow `0.0.0.0/0`)
2. Verify username and password in connection string
3. Check database name is correct
4. Test connection string in MongoDB Atlas (Connect → Test connection)

### CORS errors?

1. Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly
2. Include `https://` (not `http://`)
3. No trailing slash
4. Redeploy backend after changing

---

## 📝 Quick Reference

### Your URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **MongoDB**: `mongodb+srv://...` (from Atlas)

### Environment Variables Checklist:

**Railway (Backend):**
- ✅ `PORT=5000`
- ✅ `MONGODB_URI=your-connection-string`
- ✅ `JWT_SECRET=your-secret-key`
- ✅ `JWT_EXPIRE=7d`
- ✅ `NODE_ENV=production`
- ✅ `FRONTEND_URL=https://your-vercel-app.vercel.app`
- ✅ `BACKEND_URL=https://your-backend.railway.app`

**Vercel (Frontend):**
- ✅ `VITE_API_URL=https://your-backend.railway.app/api`

---

## 🎉 You're Done!

Your website should now be live and working! 

**Next Steps:**
1. Create your first admin user (use the createAdmin script or MongoDB)
2. Test all features
3. Share your website URL!

If you encounter any issues, check the logs in Railway and Vercel, and refer to the troubleshooting section above.
