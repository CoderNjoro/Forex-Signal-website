# How to Create an Admin User

## Method 1: Using the Script (Easiest)

1. Make sure your backend server is running and connected to MongoDB
2. Open a new terminal and run:

```bash
cd backend
node scripts/createAdmin.js your-email@example.com your-password your-username
```

Example:
```bash
node scripts/createAdmin.js admin@forex.com password123 admin
```

## Method 2: Register then Update in MongoDB

1. Go to http://localhost:3000/register
2. Register a new account with your email and password
3. Open MongoDB Compass or MongoDB Shell
4. Connect to: `mongodb://localhost:27017`
5. Select database: `forex signal site`
6. Go to `users` collection
7. Find your user document
8. Click "Edit Document" and change:
   - `role`: from `"user"` to `"admin"`
9. Save the document

## Method 3: Using MongoDB Shell

1. Open MongoDB Shell (mongosh)
2. Run:
```javascript
use("forex signal site")
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Verify Admin Access

1. Logout and login again at http://localhost:3000/login
2. You should see "Admin" link in the navbar
3. Go to http://localhost:3000/admin to access the admin panel


