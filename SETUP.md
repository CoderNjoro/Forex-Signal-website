# Quick Setup Guide

## Prerequisites
- Node.js v16+ installed
- MongoDB Atlas account (free tier) or local MongoDB
- Git (optional)

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
# Copy the content from .env.example and fill in your MongoDB URI and JWT secret
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/forex-signals?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

```bash
# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Create Admin User

1. Register a new user through the frontend at `http://localhost:3000/register`
2. Open MongoDB Atlas or your MongoDB client
3. Find your user in the `users` collection
4. Update the user document:
   ```javascript
   { $set: { role: "admin" } }
   ```

Alternatively, you can use MongoDB Compass or any MongoDB GUI tool.

### 4. Access the Platform

- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Dashboard**: http://localhost:3000/dashboard (requires login)
- **Admin Panel**: http://localhost:3000/admin (requires admin role)

## MongoDB Atlas Setup (Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier M0)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string
7. Replace `<password>` with your database user password
8. Add the database name: `forex-signals`

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/forex-signals?retryWrites=true&w=majority
```

## Troubleshooting

### Backend won't start
- Check if MongoDB URI is correct
- Ensure MongoDB cluster is running
- Verify all environment variables are set

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify `FRONTEND_URL` in backend `.env`

### Socket.io not working
- Check if both frontend and backend are running
- Verify `FRONTEND_URL` matches your frontend URL
- Check browser console for connection errors

### Authentication issues
- Clear browser localStorage
- Check JWT_SECRET is set correctly
- Verify token expiration settings

## Next Steps

1. Create your first signal as admin
2. Test real-time updates
3. Explore filtering and search features
4. Customize the platform to your needs

## Production Deployment

See the main README.md for deployment options and production considerations.


