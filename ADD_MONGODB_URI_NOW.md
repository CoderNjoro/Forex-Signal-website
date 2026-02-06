# 🚨 URGENT: Add MONGODB_URI to Railway

## The Error You're Seeing
```
Error: The `uri` parameter to `openUri()` must be a string, got "undefined"
```

This means `MONGODB_URI` is **missing** in Railway.

---

## ✅ Fix in 3 Steps

### Step 1: Get MongoDB Connection String

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: Update the Connection String

**Replace these parts:**
- `<username>` → Your MongoDB database username
- `<password>` → Your MongoDB database password
- `/?retryWrites...` → `/forex-signals?retryWrites...` (add database name!)

**Example:**
```
mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/forex-signals?retryWrites=true&w=majority
```

### Step 3: Add to Railway

1. **Open Railway:**
   - Go to your project
   - Click on your service
   - Click **"Settings"** tab

2. **Add Variable:**
   - Scroll to **"Variables"** section
   - Click **"New Variable"**
   - **Name:** `MONGODB_URI`
   - **Value:** Paste your complete connection string
   - Click **"Add"**

3. **Redeploy:**
   - Railway will auto-redeploy
   - Wait 1-2 minutes
   - Check logs - should see: `✅ MongoDB Connected: ...`

---

## 📸 Visual Guide

**In Railway Settings → Variables:**

```
┌─────────────────────────────────────┐
│ Variables                            │
├─────────────────────────────────────┤
│ Name              Value              │
├─────────────────────────────────────┤
│ PORT              5000               │
│ MONGODB_URI       [PASTE HERE] ← Add this!
│ JWT_SECRET        your-secret-key    │
│ JWT_EXPIRE        7d                 │
│ NODE_ENV          production         │
└─────────────────────────────────────┘
```

---

## ⚠️ Important Notes

1. **Database Name Required:**
   - Must include `/forex-signals` in the connection string
   - Not just `/?retryWrites...`

2. **No Quotes:**
   - Don't add quotes around the value
   - Just paste the connection string directly

3. **Special Characters:**
   - If password has `@`, `#`, `%`, encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`

4. **MongoDB Atlas Network Access:**
   - Make sure Network Access allows `0.0.0.0/0`
   - Or Railway's IP address

---

## ✅ After Adding, You Should See:

**In Railway Logs:**
```
Server running in production mode on port 8080
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

**No more errors!** 🎉

---

## 🆘 Still Getting Error?

1. **Double-check variable name:** Must be exactly `MONGODB_URI` (case-sensitive)
2. **Verify connection string:** Test it in MongoDB Compass first
3. **Check MongoDB Atlas:** Network access and database user are correct
4. **Redeploy:** Click "Redeploy" button after adding variable

---

**That's it! Add `MONGODB_URI` and your app will work!** ✅
