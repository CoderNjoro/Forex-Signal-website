# Creating Superadmin Account in Production

## Problem
The superadmin account (`admin@forex.com`) was created during development but doesn't exist in the production database on Railway.

## Solution

### Option 1: Run the Seed Script on Railway (Recommended)

1. **Connect to Railway CLI** (if you have it installed):
   ```bash
   railway login
   railway link
   ```

2. **Run the seed script**:
   ```bash
   railway run npm run seed:superadmin
   ```

   OR if you don't have Railway CLI:

3. **Add a temporary endpoint** (see Option 2 below)

### Option 2: Create Temporary Admin Endpoint

If you can't access Railway CLI, you can create a temporary endpoint to create the superadmin:

1. **Add this route temporarily** to `backend/src/routes/auth.routes.js`:
   ```javascript
   // TEMPORARY - Remove after creating superadmin
   router.post('/create-superadmin-temp', async (req, res) => {
     try {
       const { secretKey } = req.body;
       
       // Security check
       if (secretKey !== process.env.SUPERADMIN_SECRET) {
         return res.status(403).json({ message: 'Invalid secret key' });
       }

       const User = require('../models/User');
       const bcrypt = require('bcryptjs');

       // Check if exists
       const existing = await User.findOne({ email: 'admin@forex.com' });
       if (existing) {
         if (existing.role !== 'superadmin') {
           existing.role = 'superadmin';
           existing.canCreatePromotions = true;
           existing.subscriptionType = 'premium';
           await existing.save({ validateBeforeSave: false });
           return res.json({ message: 'Updated to superadmin' });
         }
         return res.json({ message: 'Superadmin already exists' });
       }

       // Create superadmin
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash('Admin@123', salt);

       await User.create({
         username: 'superadmin',
         email: 'admin@forex.com',
         password: hashedPassword,
         role: 'superadmin',
         subscriptionType: 'premium',
         canCreatePromotions: true,
         isActive: true,
       });

       res.json({ message: 'Superadmin created successfully' });
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   });
   ```

2. **Add to Railway environment variables**:
   - `SUPERADMIN_SECRET=your-random-secret-key-here`

3. **Deploy the changes to Railway**

4. **Call the endpoint** using Postman or curl:
   ```bash
   curl -X POST https://your-railway-backend.up.railway.app/api/auth/create-superadmin-temp \
     -H "Content-Type: application/json" \
     -d '{"secretKey": "your-random-secret-key-here"}'
   ```

5. **IMPORTANT: Remove the endpoint** after creating the superadmin and redeploy

### Option 3: Use MongoDB Compass or Atlas

If you have direct database access:

1. Open MongoDB Compass or MongoDB Atlas
2. Connect to your production database
3. Go to the `users` collection
4. Insert a new document:
   ```json
   {
     "username": "superadmin",
     "email": "admin@forex.com",
     "password": "$2a$10$YourHashedPasswordHere",
     "role": "superadmin",
     "subscriptionType": "premium",
     "isActive": true,
     "canCreatePromotions": true,
     "isAdminBlocked": false,
     "createdAt": "2026-02-06T20:00:00.000Z",
     "updatedAt": "2026-02-06T20:00:00.000Z"
   }
   ```

   To generate the password hash, run locally:
   ```bash
   cd backend
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Admin@123', 10).then(hash => console.log(hash));"
   ```

## Default Credentials

After creating the superadmin:
- **Email**: `admin@forex.com`
- **Password**: `Admin@123`

⚠️ **IMPORTANT**: Change this password immediately after first login!

## Verification

1. Go to your frontend: https://your-vercel-app.vercel.app
2. Click "Login"
3. Enter:
   - Email: `admin@forex.com`
   - Password: `Admin@123`
4. You should be logged in as superadmin
5. Change your password in settings

## Security Notes

- The seed script checks if the superadmin already exists to prevent duplicates
- If a user with the same email exists but isn't a superadmin, it will upgrade them
- Always remove temporary endpoints after use
- Change the default password immediately
