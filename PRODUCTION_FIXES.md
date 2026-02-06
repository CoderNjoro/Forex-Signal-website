# Production Deployment Fixes

## 🔧 Issues Fixed

### 1. **Hardcoded Localhost URLs**
**Problem**: Frontend was trying to connect to `localhost:5080` in production, causing:
- WebSocket connection failures
- API request failures
- Registration/login not working

**Solution**: 
- Updated `frontend/src/utils/constants.js` to properly use environment variables
- Now requires `VITE_API_URL` to be set in production
- Falls back to `localhost:5000` only in development mode

### 2. **Socket.io Connection Issues**
**Problem**: Socket.io was trying to connect to localhost in production

**Solution**:
- Socket connections now use `API_URL` from environment variables
- Automatically removes `/api` suffix to get base server URL
- Works correctly in both development and production

### 3. **CORS Configuration**
**Problem**: Backend CORS was too permissive or not configured for production

**Solution**:
- Updated `backend/src/server.js` with proper CORS configuration
- Dynamically allows frontend URL from `FRONTEND_URL` environment variable
- Allows localhost in development, strict in production

### 4. **Socket.io CORS**
**Problem**: Socket.io CORS wasn't properly configured for production frontend

**Solution**:
- Updated `backend/src/socket/socket.js` with dynamic CORS
- Allows production frontend URL when `FRONTEND_URL` is set
- Maintains development localhost support

## 📋 What You Need to Do

### Step 1: Set Frontend Environment Variable (Vercel)

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
   ⚠️ **Replace with your actual backend URL**

4. **Redeploy** your frontend

### Step 2: Set Backend Environment Variables

Make sure these are set in your backend hosting (Railway/Render/etc.):

```
FRONTEND_URL=https://your-vercel-app.vercel.app
BACKEND_URL=https://your-backend-url.com
```

⚠️ **Important**: 
- Use `https://` (not `http://`)
- No trailing slash
- Match your actual Vercel URL exactly

### Step 3: Redeploy Both

1. **Backend**: Redeploy to apply CORS changes
2. **Frontend**: Redeploy to use new `VITE_API_URL`

### Step 4: Test

1. Open your deployed frontend
2. Open browser DevTools → Console
3. Try to register/login
4. Check for errors:
   - ✅ Should see: "Connected to server" (Socket.io)
   - ✅ API calls should go to your backend URL (not localhost)
   - ❌ Should NOT see: "localhost:5080" or "localhost:5000"

## 🐛 Troubleshooting

### Still seeing localhost errors?

1. **Clear browser cache** - Hard refresh (Ctrl+Shift+R)
2. **Check Vercel environment variables**:
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Verify `VITE_API_URL` is set correctly
   - Make sure it's set for "Production" environment

3. **Verify backend URL**:
   - Test: `https://your-backend-url.com/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

4. **Check CORS**:
   - Verify `FRONTEND_URL` in backend matches your Vercel URL exactly
   - No trailing slashes
   - Includes `https://`

### Socket.io still not connecting?

1. Check browser console for specific error
2. Verify `VITE_API_URL` includes `/api` at the end
3. Socket.io automatically removes `/api` to get base URL
4. Check backend logs for CORS errors

### ERR_BLOCKED_BY_CLIENT?

This is usually:
- Browser extension (ad blocker)
- Try incognito mode
- Disable extensions
- Check if your backend URL is being blocked

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend loads without errors
- [ ] Browser console shows no localhost references
- [ ] API calls go to your backend URL
- [ ] Socket.io connects (check console for "Connected to server")
- [ ] Registration works
- [ ] Login works
- [ ] All routes work (no 404 errors)

## 📝 Files Changed

1. `frontend/src/utils/constants.js` - Fixed API URL handling
2. `backend/src/server.js` - Improved CORS configuration
3. `backend/src/socket/socket.js` - Fixed Socket.io CORS
4. `frontend/vercel.json` - SPA routing configuration
5. `vercel.json` - Root deployment configuration

## 🚀 Next Steps

1. Set environment variables as described above
2. Redeploy both frontend and backend
3. Test thoroughly
4. Monitor for any errors

If you still encounter issues, check the `DEPLOYMENT_GUIDE.md` for detailed troubleshooting steps.
