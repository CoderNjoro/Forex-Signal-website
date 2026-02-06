# Quick Setup Guide - Superadmin Account

## 🚀 Quick Steps (Easiest Method)

### Step 1: Add Environment Variable to Railway
1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to **Variables** tab
4. Add a new variable:
   - **Name**: `SUPERADMIN_INIT_SECRET`
   - **Value**: `MySecretKey2026!` (or any secure random string)
5. Click **Deploy** to apply changes

### Step 2: Deploy the Updated Code
1. Commit and push the changes to your repository:
   ```bash
   cd c:\Users\Tech\Desktop\ffsignal
   git add .
   git commit -m "Add superadmin initialization endpoint"
   git push
   ```
2. Railway will automatically deploy the changes

### Step 3: Initialize Superadmin
**Option A: Use the HTML Interface** (Recommended)
1. Open `initialize-superadmin.html` in your browser (double-click the file)
2. Enter your Railway backend URL (e.g., `https://your-app.up.railway.app`)
3. Enter the secret key you set in Step 1 (`MySecretKey2026!`)
4. Click "Initialize Superadmin"
5. You should see success message with login credentials

**Option B: Use curl/Postman**
```bash
curl -X POST https://your-railway-backend.up.railway.app/api/auth/initialize-superadmin \
  -H "Content-Type: application/json" \
  -d '{"secretKey": "MySecretKey2026!"}'
```

### Step 4: Login
1. Go to your frontend: https://your-vercel-app.vercel.app
2. Login with:
   - **Email**: `admin@forex.com`
   - **Password**: `Admin@123`
3. **IMPORTANT**: Change your password immediately!

### Step 5: Clean Up (Security)
1. Remove the initialization endpoint from `backend/src/routes/auth.routes.js`
   - Delete lines 41-131 (the entire `/initialize-superadmin` route)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Remove superadmin initialization endpoint"
   git push
   ```
3. Railway will auto-deploy the secure version

---

## 🔐 Default Credentials

- **Email**: `admin@forex.com`
- **Username**: `superadmin`
- **Password**: `Admin@123`

⚠️ **Change this password immediately after first login!**

---

## ❓ Troubleshooting

### "Invalid secret key" error
- Make sure the secret key in the HTML form matches exactly what you set in Railway environment variables
- Check for extra spaces or typos

### "CORS error"
- Make sure your Railway backend URL is correct
- Check that Railway has deployed the latest code

### "Network error"
- Verify your Railway backend is running (check Railway dashboard)
- Make sure the backend URL is correct (should start with `https://`)

### Superadmin already exists
- If you see this message, the account is already created
- Try logging in with the credentials above
- If you forgot the password, you can reset it through the database

---

## 📝 Notes

- This endpoint is protected by a secret key to prevent unauthorized access
- The endpoint can be called multiple times safely (it won't create duplicates)
- If a user with the same email exists but isn't a superadmin, it will upgrade them
- After creating the superadmin, **always remove the endpoint** for security
