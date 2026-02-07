# Secure M-Pesa Integration & Deployment Guide

This guide ensures your M-Pesa integration works in production without exposing critical secrets to GitHub.

## 1. Environment Configuration

### Local Development vs Production

We have updated the M-Pesa integration to dynamically switch between Sandbox and Production environments based on the `MPESA_ENVIRONMENT` variable.

- **Sandbox (Testing):** Set `MPESA_ENVIRONMENT=sandbox` (default)
- **Production (Live):** Set `MPESA_ENVIRONMENT=production`

### Required Environment Variables

Ensure these variables are set in your hosting platform (e.g., Railway, Vercel, Heroku) for the production environment. **Do not commit these to GitHub.**

```bash
# General
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com

# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your_strong_secret_key
JWT_EXPIRE=7d

# M-Pesa (Daraja API) - Get these from Safaricom Developer Portal
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_SHORTCODE=your_production_shortcode
MPESA_PASSKEY=your_production_passkey
MPESA_ENVIRONMENT=production

# Backend URL for Callbacks
# MUST be your live backend URL (https://...)
BACKEND_URL=https://your-backend-app.railway.app
```

## 2. Removing Secrets from GitHub history

If you have accidentally committed your `.env` file or other secrets:

1.  **Stop tracking the file** (but keep it locally):
    ```bash
    git rm --cached .env
    git rm --cached backend/.env
    git rm --cached frontend/.env
    ```

2.  **Add to .gitignore** (Already done for you):
    Ensure `.env` is listed in your `.gitignore` file.

3.  **Commit the removal:**
    ```bash
    git commit -m "Remove sensitive .env files from version control"
    git push origin main
    ```

*Note: If the secrets were already pushed, they are still in the git history. For high-security environments, you should rotate (change) your API keys and Passwords immediately.*

## 3. Testing M-Pesa in Production

1.  Deploy the latest changes to your backend.
2.  Ensure allow `MPESA_ENVIRONMENT=production` is set in your deployment variables.
3.  Trigger a payment from the live website.
4.  Monitoring logs: The backend will now log `Initiating STK Push (production)...` instead of sandbox.

## 4. Frontend Configuration

For the frontend to connect to the production backend, verify `VITE_API_URL` is set in your Vercel/Netlify dashboard:

```bash
VITE_API_URL=https://your-backend-app.railway.app/api
```
