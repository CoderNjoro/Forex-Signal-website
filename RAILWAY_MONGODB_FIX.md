# 🚨 Fix: MongoDB Connection Error

## The Error
```
Error: The `uri` parameter to `openUri()` must be a string, got "undefined"
```

## The Problem
The `MONGODB_URI` environment variable is **missing** in Railway.

## ✅ THE FIX

### Step 1: Get Your MongoDB Connection String

If you don't have it yet:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 2: Update Connection String

**IMPORTANT:** You need to:
1. Replace `<username>` with your MongoDB username
2. Replace `<password>` with your MongoDB password
3. Add database name: Change `/?retryWrites...` to `/forex-signals?retryWrites...`

**Final format:**
```
mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/forex-signals?retryWrites=true&w=majority
```

### Step 3: Add to Railway

1. **Go to Railway Dashboard**
   - Open your project
   - Click on your service
   - Click **"Settings"** tab

2. **Add Environment Variable**
   - Scroll to **"Variables"** section
   - Click **"New Variable"** button
   - **Name:** `MONGODB_URI`
   - **Value:** Paste your complete connection string
   - Click **"Add"**

3. **Verify It's Added**
   - You should see `MONGODB_URI` in the variables list
   - Make sure there are no extra spaces

### Step 4: Redeploy

1. Railway will automatically redeploy
2. OR click **"Redeploy"** button
3. Wait 1-2 minutes
4. Check logs - should see: `MongoDB Connected: ...`

---

## 📋 Complete Environment Variables Checklist

Make sure you have ALL of these in Railway Settings → Variables:

| Variable Name | Example Value | Status |
|--------------|---------------|--------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/forex-signals?retryWrites=true&w=majority` | ✅ **REQUIRED** |
| `PORT` | `5000` | ✅ Required |
| `JWT_SECRET` | `your-super-secret-key-min-32-chars-long` | ✅ Required |
| `JWT_EXPIRE` | `7d` | ✅ Required |
| `NODE_ENV` | `production` | ✅ Required |
| `FRONTEND_URL` | `https://your-app.vercel.app` | ⚠️ Add later |
| `BACKEND_URL` | `https://your-app.railway.app` | ⚠️ Add after deploy |

---

## 🔍 Verify MongoDB Atlas Settings

Make sure in MongoDB Atlas:

1. **Network Access:**
   - Go to Network Access
   - Add IP: `0.0.0.0/0` (allows all IPs)
   - Or add Railway's IP if you know it

2. **Database User:**
   - Go to Database Access
   - Make sure your user exists
   - Password is correct
   - User has read/write permissions

3. **Connection String:**
   - Username and password are URL-encoded (special chars encoded)
   - Database name is included: `/forex-signals`
   - No extra spaces or quotes

---

## 🎯 Expected Result

After adding `MONGODB_URI`, logs should show:

```
Server running in production mode on port 8080
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
✅ Server is running successfully!
```

**No more errors!** ✅

---

## ⚠️ Common Mistakes

1. **Missing database name:**
   - ❌ Wrong: `mongodb+srv://...mongodb.net/?retryWrites...`
   - ✅ Right: `mongodb+srv://...mongodb.net/forex-signals?retryWrites...`

2. **Wrong username/password:**
   - Make sure you're using the MongoDB Atlas database user credentials
   - Not your MongoDB Atlas account login

3. **Special characters in password:**
   - If password has special chars like `@`, `#`, `%`, they need to be URL-encoded
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `%` becomes `%25`

4. **Extra spaces:**
   - Make sure no spaces before/after the connection string
   - No quotes around the value

---

## 🆘 Still Not Working?

1. **Check Railway Logs:**
   - Look for the exact error message
   - Check if `MONGODB_URI` shows as undefined

2. **Test Connection String:**
   - Try connecting with MongoDB Compass or `mongosh`
   - If it works locally, it should work on Railway

3. **Verify Variable Name:**
   - Must be exactly: `MONGODB_URI` (case-sensitive)
   - No typos, no spaces

4. **Check MongoDB Atlas:**
   - Network access allows `0.0.0.0/0`
   - Database user is active
   - Cluster is running

---

**The fix: Add `MONGODB_URI` environment variable in Railway!**
