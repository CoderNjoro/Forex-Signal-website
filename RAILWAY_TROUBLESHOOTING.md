# Railway Deployment Troubleshooting Guide

## 🚨 Common Build Failure: "Build failed"

### Problem
When importing from GitHub, Railway tries to build from the root directory, but your backend code is in the `backend/` folder.

### ✅ Solution: Set Root Directory

**Step 1: Access Settings**
1. In Railway dashboard, click on your project
2. Click on the service (usually named after your repo)
3. Click the **"Settings"** tab

**Step 2: Configure Root Directory**
1. Scroll down to find **"Root Directory"** section
2. Click **"Edit"** or the input field
3. Enter: `backend`
4. Click **"Save"**

**Step 3: Redeploy**
1. Railway will automatically redeploy after saving
2. Or click **"Redeploy"** button manually
3. Wait for build to complete

---

## 🔍 Other Common Issues

### Issue 1: "Cannot find module" errors

**Cause**: Missing dependencies or wrong Node version

**Solution**:
1. Check Railway logs for specific module name
2. Verify `backend/package.json` has all dependencies
3. Railway auto-detects Node.js version from `package.json`
4. If needed, add `engines` to `package.json`:
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

### Issue 2: "PORT is not defined"

**Cause**: Missing environment variable

**Solution**:
1. Go to Settings → Variables
2. Add variable:
   - Name: `PORT`
   - Value: `5000`
3. Click "Add"
4. Redeploy

### Issue 3: "MongoDB connection failed"

**Cause**: Missing or incorrect `MONGODB_URI`

**Solution**:
1. Go to Settings → Variables
2. Add variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/forex-signals?retryWrites=true&w=majority`
3. Make sure:
   - Username and password are correct
   - Network access allows `0.0.0.0/0` in MongoDB Atlas
   - Database name is included (`forex-signals`)

### Issue 4: Build succeeds but app crashes

**Cause**: Missing required environment variables

**Solution**: Add all required variables:
- `PORT=5000`
- `MONGODB_URI=your_connection_string`
- `JWT_SECRET=your_secret_key_min_32_chars`
- `JWT_EXPIRE=7d`
- `NODE_ENV=production`
- `FRONTEND_URL=https://your-frontend.vercel.app` (can be placeholder initially)
- `BACKEND_URL=https://your-backend.railway.app` (update after getting URL)

---

## 📋 Complete Railway Setup Checklist

### Before Deployment:
- [ ] Root Directory set to `backend`
- [ ] All environment variables added
- [ ] MongoDB Atlas cluster created and accessible
- [ ] Network access allows `0.0.0.0/0`

### After Deployment:
- [ ] Build status is "Success" (green checkmark)
- [ ] Service shows "Active" status
- [ ] Domain URL is generated
- [ ] Health check works: `https://your-app.railway.app/api/health`
- [ ] Logs show "Server running on port 5000"

---

## 🛠️ Manual Build Configuration (if needed)

If Railway still has issues, you can create a `nixpacks.toml` file in the `backend/` directory:

```toml
[phases.setup]
nixPkgs = ['nodejs-18_x']

[phases.install]
cmds = ['npm install']

[start]
cmd = 'npm start'
```

However, Railway should auto-detect Node.js projects, so this is usually not needed.

---

## 📞 Still Having Issues?

1. **Check Railway Logs**:
   - Go to your service → "Deployments" tab
   - Click on the latest deployment
   - Check "Build Logs" and "Deploy Logs"
   - Look for red error messages

2. **Verify File Structure**:
   - Ensure `backend/package.json` exists
   - Ensure `backend/src/server.js` exists
   - Ensure `backend/` folder is committed to GitHub

3. **Test Locally First**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   If it works locally, it should work on Railway (with proper env vars)

4. **Common Log Errors**:
   - "ENOENT: no such file" → Root directory wrong
   - "Cannot find module" → Missing dependency in package.json
   - "Port already in use" → Another service using port (unlikely on Railway)
   - "ECONNREFUSED" → MongoDB connection issue

---

## 🎯 Quick Fix Summary

**Most Common Fix**:
1. Settings → Root Directory → Set to `backend`
2. Save → Redeploy
3. ✅ Done!

If that doesn't work, check environment variables and logs.
