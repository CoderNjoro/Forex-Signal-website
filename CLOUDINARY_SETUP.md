# ☁️ Cloudinary Setup for Permanent Image Storage

To prevent images from disappearing when Railway redeploys your app, we have switched from local storage to **Cloudinary**.

## 1. Register for Cloudinary
If you don't have an account, sign up for free at [Cloudinary.com](https://cloudinary.com/).

## 2. Get Your Credentials
Once logged in, go to your **Dashboard** and find:
- **Cloud Name**
- **API Key**
- **API Secret**

## 3. Add Environment Variables to Railway
Go to your Railway Dashboard → Your Backend Service → **Settings** → **Variables** and add these:

| Variable | Value |
|----------|-------|
| `CLOUDINARY_CLOUD_NAME` | (Your Cloud Name) |
| `CLOUDINARY_API_KEY` | (Your API Key) |
| `CLOUDINARY_API_SECRET` | (Your API Secret) |

## 4. How it Works
- All **new** images you upload for **Signals** or **Promotions** will be stored permanently in the cloud.
- The app will automatically handle both your old local images (if they still exist) and new cloud images.
- Images will **never** disappear again after a server restart or update! ✅

---

**Note**: To apply these changes, you must commit and push the latest code changes to your repository.
