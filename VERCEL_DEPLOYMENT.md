# Vercel Deployment Guide

## Quick Fix for 404 Errors

The 404 error occurs because Vercel needs to be configured to handle client-side routing for React SPAs. This has been fixed with the `vercel.json` configuration files.

## Deployment Steps

### Option 1: Deploy from Root (Monorepo)

If deploying the entire project from the root:

1. **Set Root Directory in Vercel:**
   - Go to your Vercel project settings
   - Under "Root Directory", set it to `frontend`

2. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables:**
   - Add `VITE_API_URL` with your backend API URL
   - Example: `https://your-backend-url.com/api`

### Option 2: Deploy Frontend Only (Recommended)

1. **Connect Repository:**
   - Import your Git repository to Vercel
   - Select the `frontend` folder as the root directory

2. **Configure Build Settings:**
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically detect Vite and configure it

## Important Configuration Files

### `frontend/vercel.json`
This file handles SPA routing by rewriting all non-API routes to `index.html`.

### Environment Variables Required

Make sure to set these in Vercel Dashboard → Settings → Environment Variables:

- `VITE_API_URL` - Your backend API URL (e.g., `https://your-backend.railway.app/api`)

## Troubleshooting

### Still Getting 404 Errors?

1. **Check Root Directory:**
   - Ensure Vercel is set to use `frontend` as root
   - Or deploy from root with proper configuration

2. **Verify Build Output:**
   - Check that `dist` folder contains `index.html`
   - Verify build completes successfully

3. **Check Rewrites:**
   - The `vercel.json` should rewrite all routes to `index.html`
   - API routes should be excluded from rewrites

### API Connection Issues?

1. **CORS Configuration:**
   - Make sure your backend allows requests from your Vercel domain
   - Update `FRONTEND_URL` in backend environment variables

2. **API URL:**
   - Verify `VITE_API_URL` is set correctly in Vercel
   - Should be your backend URL + `/api`

## Backend Deployment

For the backend, deploy to:
- **Railway.app** (recommended)
- **Render.com**
- **Fly.io**
- **Heroku**

Then update `VITE_API_URL` in Vercel to point to your deployed backend.

## Testing After Deployment

1. Visit your Vercel URL
2. Try navigating to different routes:
   - `/signals`
   - `/dashboard`
   - `/admin`
   - `/subscription`
3. All routes should work without 404 errors

## Notes

- The `vercel.json` file ensures all client-side routes are handled by React Router
- API routes are excluded from rewrites to allow backend communication
- Make sure your backend CORS is configured to allow your Vercel domain
