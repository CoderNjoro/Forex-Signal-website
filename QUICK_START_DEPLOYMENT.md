# Quick Start: Deploy Your Website

Follow these steps in order. Each step has detailed instructions.

## 🎯 The Process (Overview)

1. **Set up MongoDB Atlas** (cloud database) - 10 minutes
2. **Deploy Backend to Railway** - 15 minutes  
3. **Deploy Frontend to Vercel** - 10 minutes
4. **Connect them together** - 5 minutes

**Total time: ~40 minutes**

---

## 📝 Step-by-Step Instructions

### STEP 1: MongoDB Atlas Setup

**What you're doing**: Creating a cloud database (replaces your local MongoDB)

**Where**: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

**Detailed guide**: See `MONGODB_SETUP.md`

**Quick steps**:
1. Sign up (free)
2. Create cluster (choose M0 FREE)
3. Create database user (save password!)
4. Set network access to `0.0.0.0/0`
5. Get connection string
6. Replace `<username>` and `<password>` in connection string
7. Add database name: `/forex-signals?retryWrites...`

**Result**: You have a connection string like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/forex-signals?retryWrites=true&w=majority
```

---

### STEP 2: Deploy Backend to Railway

**What you're doing**: Hosting your backend API online

**Where**: [railway.app](https://railway.app)

**Detailed guide**: See `STEP_BY_STEP_DEPLOYMENT.md` Part 2

**Quick steps**:

1. **Sign up with GitHub**
   - Go to railway.app
   - Click "Start a New Project"
   - Sign up with GitHub

2. **Create Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `ffsignal` repository
   - Railway starts deploying

3. **Set Root Directory**
   - Click your project
   - Click the service
   - Go to "Settings" tab
   - Find "Root Directory"
   - Change to: `backend`
   - Click "Save"

4. **Add Environment Variables**
   - Still in Settings, find "Variables" section
   - Click "New Variable" for each:

   | Variable Name | Value | Notes |
   |--------------|-------|-------|
   | `PORT` | `5000` | |
   | `MONGODB_URI` | `mongodb+srv://...` | Your connection string from Step 1 |
   | `JWT_SECRET` | `your-long-random-string-here` | Make it long and random |
   | `JWT_EXPIRE` | `7d` | |
   | `NODE_ENV` | `production` | |
   | `FRONTEND_URL` | `https://your-app.vercel.app` | We'll update this later |
   | `BACKEND_URL` | `https://your-backend.railway.app` | We'll get this after deploy |

5. **Get Your Backend URL**
   - Go to "Settings" → "Domains"
   - Copy the URL (e.g., `your-app.railway.app`)
   - This is your backend URL!
   - Update `BACKEND_URL` variable with this URL
   - Click "Redeploy"

6. **Test Backend**
   - Open: `https://your-backend.railway.app/api/health`
   - Should see: `{"status":"OK","message":"Server is running"}`

---

### STEP 3: Deploy Frontend to Vercel

**What you're doing**: Hosting your website online

**Where**: [vercel.com](https://vercel.com)

**Detailed guide**: See `STEP_BY_STEP_DEPLOYMENT.md` Part 3

**Quick steps**:

1. **Sign up with GitHub**
   - Go to vercel.com
   - Click "Sign Up"
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Select your `ffsignal` repository
   - Click "Import"

3. **Configure Project**
   - **Root Directory**: Click "Edit" → Set to `frontend`
   - **Framework**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto)
   - **Output Directory**: `dist` (auto)
   - **Install Command**: `npm install` (auto)

4. **Add Environment Variable**
   - Scroll to "Environment Variables"
   - Click "Add"
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.railway.app/api`
     - ⚠️ Use your actual Railway backend URL from Step 2!
   - Check all environments (Production, Preview, Development)
   - Click "Add"

5. **Deploy**
   - Click "Deploy" button
   - Wait 1-2 minutes
   - Copy your Vercel URL (e.g., `your-app.vercel.app`)

---

### STEP 4: Connect Frontend and Backend

**What you're doing**: Telling backend about frontend URL (for CORS)

**Where**: Railway dashboard

**Quick steps**:

1. Go back to Railway
2. Go to your project → Settings → Variables
3. Find `FRONTEND_URL` variable
4. Click "Edit" (pencil icon)
5. Update to: `https://your-vercel-app.vercel.app`
   - ⚠️ Use your actual Vercel URL from Step 3!
6. Click "Save"
7. Railway auto-redeploys

---

## ✅ Testing Checklist

After deployment, test these:

- [ ] Backend health: `https://your-backend.railway.app/api/health` works
- [ ] Frontend loads: `https://your-app.vercel.app` shows your site
- [ ] No localhost errors in browser console
- [ ] Registration works
- [ ] Login works
- [ ] Socket.io connects (check console for "Connected to server")

---

## 🎯 Your URLs Summary

After deployment, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **Database**: MongoDB Atlas (cloud)

---

## 🆘 Need Help?

### Common Issues:

**"Can't connect to database"**
- Check MongoDB connection string is correct
- Verify network access allows `0.0.0.0/0`
- Check username/password in connection string

**"Frontend shows localhost errors"**
- Verify `VITE_API_URL` is set in Vercel
- Make sure it includes `/api` at the end
- Clear browser cache (Ctrl+Shift+R)

**"CORS errors"**
- Check `FRONTEND_URL` in Railway matches Vercel URL exactly
- Include `https://` (not `http://`)
- No trailing slash
- Redeploy backend

**"Backend not starting"**
- Check Railway logs
- Verify all environment variables are set
- Check MongoDB connection string

---

## 📚 Detailed Guides

For more detailed instructions, see:

- `MONGODB_SETUP.md` - Complete MongoDB Atlas setup
- `STEP_BY_STEP_DEPLOYMENT.md` - Full deployment guide
- `DEPLOYMENT_GUIDE.md` - Advanced deployment options
- `PRODUCTION_FIXES.md` - Troubleshooting guide

---

## 🎉 You're Done!

Your website is now live! Share your Vercel URL with others.

**Next Steps**:
1. Create your first admin user
2. Test all features
3. Customize your website

Good luck! 🚀
