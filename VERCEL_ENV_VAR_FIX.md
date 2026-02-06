# 🚨 Fix: Frontend Connecting to Localhost in Production

## The Problem

Your frontend is trying to connect to `localhost:5080` instead of your Railway backend. This happens because `VITE_API_URL` is **not set** in Vercel.

**Errors you're seeing:**
```
WebSocket connection to 'ws://localhost:5080/socket.io/...' failed
Failed to load resource: localhost:5080/api/auth/register
```

## ✅ THE FIX

### Step 1: Get Your Railway Backend URL

1. Go to your Railway dashboard
2. Click on your backend service
3. Go to **Settings** → **Domains**
4. Copy your Railway URL (e.g., `your-app.railway.app`)

### Step 2: Add Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - Open https://vercel.com
   - Click on your project

2. **Open Settings**
   - Click **"Settings"** tab
   - Click **"Environment Variables"** in the left sidebar

3. **Add New Variable**
   - Click **"Add New"** button
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-app.railway.app/api`
     - ⚠️ **Replace `your-app.railway.app` with your actual Railway URL!**
     - ⚠️ **Must include `/api` at the end!**
     - ⚠️ **Use `https://` (not `http://`)**
   
4. **Select Environments**
   - ✅ Check **Production**
   - ✅ Check **Preview**
   - ✅ Check **Development** (optional, for testing)
   - Click **"Save"**

### Step 3: Redeploy Frontend

1. **Redeploy in Vercel**
   - Go to **"Deployments"** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**
   - OR push a new commit to trigger redeploy

2. **Wait for Deployment**
   - Wait 1-2 minutes for build to complete
   - Check that deployment succeeds

### Step 4: Clear Browser Cache

1. **Hard Refresh**
   - Press `Ctrl + Shift + R` (Windows/Linux)
   - Press `Cmd + Shift + R` (Mac)
   - OR open in incognito/private window

2. **Test Again**
   - Try registering/login
   - Check browser console
   - Should see connections to your Railway URL (not localhost)

---

## 📋 Complete Checklist

### In Vercel (Frontend):

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | `https://your-backend.railway.app/api` | `https://outstanding-perception.railway.app/api` |

### In Railway (Backend):

| Variable | Value | Example |
|----------|-------|---------|
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | `https://your-app.vercel.app` |
| `BACKEND_URL` | `https://your-backend.railway.app` | `https://outstanding-perception.railway.app` |

---

## 🎯 Expected Result

After adding `VITE_API_URL` and redeploying:

**In Browser Console:**
- ✅ Should see: `Connected to server` (Socket.io)
- ✅ API calls go to: `https://your-backend.railway.app/api/...`
- ❌ Should NOT see: `localhost:5080` or `localhost:5000`

**Network Tab:**
- ✅ Requests go to your Railway backend
- ✅ WebSocket connects to your Railway backend
- ✅ Registration/login works

---

## 🔍 Verify It's Working

1. **Check Environment Variable:**
   - Vercel → Settings → Environment Variables
   - Verify `VITE_API_URL` is set correctly
   - Check it's enabled for Production

2. **Check Build Logs:**
   - Vercel → Deployments → Latest deployment → Build Logs
   - Should not show any errors about missing variables

3. **Check Browser Console:**
   - Open DevTools → Console
   - Should NOT see: "VITE_API_URL environment variable is not set!"
   - Should see: "Connected to server"

4. **Test API Connection:**
   - Open DevTools → Network tab
   - Try to register/login
   - Check that requests go to your Railway URL

---

## ⚠️ Common Mistakes

1. **Missing `/api` suffix:**
   - ❌ Wrong: `https://your-backend.railway.app`
   - ✅ Right: `https://your-backend.railway.app/api`

2. **Using `http://` instead of `https://`:**
   - ❌ Wrong: `http://your-backend.railway.app/api`
   - ✅ Right: `https://your-backend.railway.app/api`

3. **Trailing slash:**
   - ❌ Wrong: `https://your-backend.railway.app/api/`
   - ✅ Right: `https://your-backend.railway.app/api`

4. **Not redeploying:**
   - After adding environment variable, you MUST redeploy
   - Environment variables are baked into the build at build time

5. **Wrong environment:**
   - Make sure `VITE_API_URL` is enabled for "Production"
   - Preview and Development are optional

---

## 🆘 Still Not Working?

### Issue: Still seeing localhost errors

1. **Clear browser cache completely:**
   - Open DevTools → Application → Clear Storage → Clear site data
   - Or use incognito mode

2. **Verify variable is set:**
   - Vercel → Settings → Environment Variables
   - Make sure `VITE_API_URL` shows your Railway URL

3. **Check deployment:**
   - Make sure latest deployment completed successfully
   - Check build logs for errors

4. **Verify Railway backend:**
   - Test: `https://your-backend.railway.app/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

### Issue: ERR_BLOCKED_BY_CLIENT

This is usually:
- Browser extension (ad blocker)
- Try incognito mode
- Disable extensions temporarily
- Check if Railway URL is being blocked

### Issue: CORS errors

1. **Check Railway backend:**
   - Settings → Variables
   - Verify `FRONTEND_URL` matches your Vercel URL exactly
   - No trailing slash
   - Includes `https://`

2. **Redeploy backend:**
   - After changing `FRONTEND_URL`, redeploy backend

---

## 📝 Quick Reference

**Vercel Environment Variable:**
```
Name: VITE_API_URL
Value: https://your-backend.railway.app/api
Environments: Production, Preview, Development
```

**After adding:**
1. Save the variable
2. Redeploy frontend
3. Clear browser cache
4. Test again

---

**That's it! Add `VITE_API_URL` in Vercel and redeploy!** ✅
