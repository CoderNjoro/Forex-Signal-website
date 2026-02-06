# 🚨 Fix: CORS Error - Access-Control-Allow-Origin

## The Error
```
Access to XMLHttpRequest at 'https://forex-signal-website-njoro.up.railway.app/api/auth/register' 
from origin 'https://forex-signal-website-sage.vercel.app' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## The Problem

Your Railway backend doesn't have `FRONTEND_URL` set, or it's set incorrectly. The backend needs to know which frontend domain to allow.

**Your Frontend URL:** `https://forex-signal-website-sage.vercel.app`  
**Your Backend URL:** `https://forex-signal-website-njoro.up.railway.app`

## ✅ THE FIX

### Step 1: Add FRONTEND_URL to Railway

1. **Go to Railway Dashboard**
   - Open https://railway.app
   - Click on your backend project
   - Click on your service

2. **Open Settings**
   - Click **"Settings"** tab
   - Scroll to **"Variables"** section

3. **Add FRONTEND_URL Variable**
   - Click **"New Variable"** button
   - **Name:** `FRONTEND_URL`
   - **Value:** `https://forex-signal-website-sage.vercel.app`
     - ⚠️ **Use your exact Vercel URL!**
     - ⚠️ **Must start with `https://`**
     - ⚠️ **No trailing slash**
   
4. **Click "Add"**

### Step 2: Verify Other Variables

Make sure you also have these variables set:

| Variable | Value | Status |
|----------|-------|--------|
| `FRONTEND_URL` | `https://forex-signal-website-sage.vercel.app` | ✅ **REQUIRED** |
| `BACKEND_URL` | `https://forex-signal-website-njoro.up.railway.app` | ✅ Required |
| `MONGODB_URI` | `mongodb+srv://...` | ✅ Required |
| `PORT` | `5000` | ✅ Required |
| `JWT_SECRET` | `your-secret-key` | ✅ Required |
| `JWT_EXPIRE` | `7d` | ✅ Required |
| `NODE_ENV` | `production` | ✅ Required |

### Step 3: Redeploy Backend

1. **Redeploy in Railway**
   - After adding `FRONTEND_URL`, Railway will auto-redeploy
   - OR click **"Redeploy"** button manually
   - Wait 1-2 minutes for deployment

2. **Check Logs**
   - Go to **"Deployments"** tab
   - Click on latest deployment
   - Check logs - should see server starting successfully

### Step 4: Test Again

1. **Clear Browser Cache**
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Or use incognito mode

2. **Try Registration**
   - Go to your frontend: https://forex-signal-website-sage.vercel.app/register
   - Try to register
   - Should work now! ✅

---

## 📋 Correct Format

**Your Vercel Frontend URL:**
```
https://forex-signal-website-sage.vercel.app
```

**Railway Variable:**
```
FRONTEND_URL=https://forex-signal-website-sage.vercel.app
```

**Important:**
- ✅ Must start with `https://`
- ✅ No trailing slash
- ✅ Match your Vercel URL exactly
- ✅ Case-sensitive (use exact domain)

---

## 🎯 Expected Result

After adding `FRONTEND_URL` and redeploying:

**In Railway Logs:**
- Should see: `Server running in production mode on port 5000`
- Should see CORS logs when requests come in

**In Browser:**
- ✅ Registration works
- ✅ Login works
- ✅ No CORS errors
- ✅ API calls succeed

**In Browser Console:**
- ✅ No CORS errors
- ✅ Requests succeed (200/201 status)
- ✅ "Connected to server" (Socket.io)

---

## 🔍 Verify It's Set Correctly

1. **Check Railway Variables:**
   - Railway → Settings → Variables
   - Verify `FRONTEND_URL` = `https://forex-signal-website-sage.vercel.app`
   - Make sure no extra spaces or quotes

2. **Check Railway Logs:**
   - After a request, check logs
   - Should see: `✅ Origin allowed: https://forex-signal-website-sage.vercel.app`
   - Should NOT see: `❌ CORS Error`

3. **Test Backend Health:**
   - Open: `https://forex-signal-website-njoro.up.railway.app/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

---

## ⚠️ Common Mistakes

1. **Missing `https://`:**
   - ❌ Wrong: `forex-signal-website-sage.vercel.app`
   - ✅ Right: `https://forex-signal-website-sage.vercel.app`

2. **Trailing slash:**
   - ❌ Wrong: `https://forex-signal-website-sage.vercel.app/`
   - ✅ Right: `https://forex-signal-website-sage.vercel.app`

3. **Wrong domain:**
   - Make sure it matches your Vercel URL exactly
   - Check Vercel → Settings → Domains to verify

4. **Not redeploying:**
   - After adding variable, you MUST redeploy
   - Environment variables are loaded at startup

5. **Extra spaces or quotes:**
   - No spaces before/after the URL
   - No quotes around the value

---

## 🆘 Still Getting CORS Error?

1. **Double-check the value:**
   - Copy exact URL from Vercel
   - Paste into Railway variable
   - Verify no typos

2. **Check Railway logs:**
   - Look for CORS error messages
   - Should show what origin was received vs expected

3. **Verify both URLs:**
   - Frontend: `https://forex-signal-website-sage.vercel.app`
   - Backend: `https://forex-signal-website-njoro.up.railway.app`
   - Make sure `FRONTEND_URL` matches frontend exactly

4. **Redeploy both:**
   - Redeploy backend after setting `FRONTEND_URL`
   - Clear browser cache
   - Try again

5. **Check for typos:**
   - `forex-signal-website-sage` (not `forex-signal-website-sage` with different spelling)
   - `.vercel.app` (not `.vercel.com`)

---

## 📝 Quick Checklist

- [ ] `FRONTEND_URL` added to Railway
- [ ] Value = `https://forex-signal-website-sage.vercel.app`
- [ ] No trailing slash
- [ ] Includes `https://`
- [ ] Backend redeployed
- [ ] Browser cache cleared
- [ ] Test registration/login

---

**The fix: Add `FRONTEND_URL` to Railway with your Vercel URL and redeploy!** ✅
