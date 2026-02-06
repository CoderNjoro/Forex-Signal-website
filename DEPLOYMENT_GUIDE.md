# Complete Deployment Guide

This guide will help you deploy both frontend and backend to production.

## 🚀 Quick Deployment Checklist

### Frontend (Vercel)
- [ ] Set `VITE_API_URL` environment variable
- [ ] Deploy to Vercel
- [ ] Verify routes work (no 404 errors)

### Backend (Railway/Render/Fly.io)
- [ ] Set all environment variables
- [ ] Set `FRONTEND_URL` to your Vercel URL
- [ ] Deploy backend
- [ ] Test API endpoints

## 📋 Step-by-Step Deployment

### 1. Backend Deployment

#### Option A: Railway.app (Recommended)

1. **Create Account & Project**
   - Go to [railway.app](https://railway.app)
   - Sign up/login
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder as root

2. **Configure Environment Variables**
   Go to Settings → Variables and add:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_very_secure_secret_key_here
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   BACKEND_URL=https://your-backend.railway.app
   ```

3. **Deploy**
   - Railway will auto-detect Node.js
   - Build command: `npm install`
   - Start command: `npm start`
   - Railway will provide a URL like: `https://your-app.railway.app`

#### Option B: Render.com

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - New → Web Service
   - Connect your GitHub repo
   - Select `backend` folder

2. **Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

3. **Environment Variables** (same as Railway)

#### Option C: Fly.io

1. **Install Fly CLI**: `npm install -g @fly/cli`
2. **Login**: `fly auth login`
3. **Initialize**: `cd backend && fly launch`
4. **Set Secrets**: `fly secrets set KEY=value`
5. **Deploy**: `fly deploy`

### 2. Frontend Deployment (Vercel)

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables**
   Add in Vercel Dashboard → Settings → Environment Variables:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
   ⚠️ **Important**: Replace with your actual backend URL

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a URL like: `https://your-app.vercel.app`

### 3. Update Backend with Frontend URL

After deploying frontend, update backend environment variable:

```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

Then redeploy backend to apply CORS changes.

## 🔧 Environment Variables Reference

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/forex-signals?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
BACKEND_URL=https://your-backend.railway.app

# M-Pesa (if using)
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
```

### Frontend (Vercel Environment Variables)
```
VITE_API_URL=https://your-backend.railway.app/api
```

## ✅ Post-Deployment Testing

### 1. Test Frontend
- [ ] Visit your Vercel URL
- [ ] Check browser console for errors
- [ ] Try registering a new user
- [ ] Try logging in
- [ ] Navigate to different routes (`/signals`, `/dashboard`, etc.)

### 2. Test Backend
- [ ] Visit `https://your-backend.railway.app/api/health`
- [ ] Should return: `{"status":"OK","message":"Server is running"}`

### 3. Test API Connection
- [ ] Open browser DevTools → Network tab
- [ ] Try registering/login
- [ ] Check that API calls go to your backend URL (not localhost)
- [ ] Verify no CORS errors

### 4. Test Socket.io
- [ ] After logging in, check browser console
- [ ] Should see: "Connected to server" or "Socket connected"
- [ ] No WebSocket errors to localhost

## 🐛 Troubleshooting

### Issue: 404 Errors on Routes
**Solution**: The `vercel.json` file should handle this. Make sure:
- `frontend/vercel.json` exists with rewrites
- Root directory is set to `frontend` in Vercel

### Issue: API Calls Going to Localhost
**Solution**: 
- Check `VITE_API_URL` is set in Vercel
- Rebuild and redeploy frontend
- Clear browser cache

### Issue: CORS Errors
**Solution**:
- Verify `FRONTEND_URL` in backend matches your Vercel URL exactly
- Include protocol (`https://`)
- No trailing slash
- Redeploy backend after changing

### Issue: Socket.io Connection Failed
**Solution**:
- Check `VITE_API_URL` is set correctly
- Verify backend `FRONTEND_URL` includes your Vercel domain
- Check backend logs for CORS errors
- Ensure WebSocket is enabled on your hosting provider

### Issue: Registration/Login Not Working
**Solution**:
- Check browser console for errors
- Verify backend is running and accessible
- Check MongoDB connection string
- Verify JWT_SECRET is set

### Issue: ERR_BLOCKED_BY_CLIENT
**Solution**:
- This is usually an ad blocker or browser extension
- Try in incognito mode
- Disable browser extensions
- Check if your backend URL is being blocked

## 🔒 Security Checklist

- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Use HTTPS for both frontend and backend
- [ ] Set `NODE_ENV=production`
- [ ] Don't commit `.env` files
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Enable CORS only for your frontend domain
- [ ] Use environment variables for all secrets

## 📝 Additional Notes

### MongoDB Atlas Setup
1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (or specific IPs for production)
4. Get connection string
5. Replace `<password>` with actual password

### Custom Domain (Optional)
- **Vercel**: Add domain in project settings
- **Railway**: Use custom domain feature
- Update `FRONTEND_URL` and `VITE_API_URL` accordingly

### Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Set up uptime monitoring
- Check logs regularly

## 🎯 Quick Commands

### Check Backend Health
```bash
curl https://your-backend.railway.app/api/health
```

### Test API Endpoint
```bash
curl -X POST https://your-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs
3. Verify all environment variables are set
4. Test API endpoints directly
5. Check CORS configuration

---

**Remember**: Always test in production after deployment to ensure everything works correctly!
