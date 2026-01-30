# Forex Signals Platform

A comprehensive forex trading signals platform built with React and Node.js, featuring real-time signal updates, user authentication, admin panel, and performance tracking.

## Features

### Core Features
- ✅ User authentication (register/login)
- ✅ Admin panel for signal creation and management
- ✅ Real-time signal display with Socket.io
- ✅ Signal filtering (pair, status, type, timeframe)
- ✅ Performance tracking and statistics
- ✅ Responsive design with Tailwind CSS
- ✅ Protected routes and role-based access

### User Features
- View all trading signals
- Filter signals by various criteria
- View signal details
- Dashboard with active signals overview
- Profile management

### Admin Features
- Create, update, and delete signals
- View platform statistics
- Performance analytics
- User management (future)

## Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time updates
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
ffsignal/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and app config
│   │   ├── models/          # MongoDB models
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth and validation
│   │   ├── socket/          # Socket.io setup
│   │   └── server.js        # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context
│   │   ├── services/        # API services
│   │   ├── utils/           # Helpers and constants
│   │   └── App.jsx          # Main app component
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/forex-signals?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Creating Your First Admin User

To create an admin user, you can either:

1. **Use MongoDB directly**: After registering a user, update the user document in MongoDB:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

2. **Add admin creation script**: Create a script to seed an admin user (recommended for production)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Signals
- `GET /api/signals` - Get all signals (with filters)
- `GET /api/signals/active` - Get active signals
- `GET /api/signals/:id` - Get single signal
- `POST /api/signals` - Create signal (Admin only)
- `PUT /api/signals/:id` - Update signal (Admin only)
- `DELETE /api/signals/:id` - Delete signal (Admin only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Update password

### Admin
- `GET /api/admin/users` - Get all users (Admin only)
- `PUT /api/admin/users/:id` - Update user (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)
- `GET /api/admin/stats` - Get platform statistics (Admin only)
- `GET /api/admin/performance` - Get performance data (Admin only)

## Deployment

### Backend Deployment Options
- **Railway.app** - Free tier available
- **Render.com** - Free tier (spins down after inactivity)
- **Fly.io** - Free tier available
- **Heroku** - Paid (no free tier)

### Frontend Deployment Options
- **Vercel** - Recommended, unlimited free hosting
- **Netlify** - Free tier available
- **GitHub Pages** - Free for static sites

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Strong secret key
- `FRONTEND_URL` - Your frontend URL
- `NODE_ENV=production`

## Future Enhancements

- [ ] Email notifications for new signals
- [ ] Push notifications
- [ ] Telegram bot integration
- [ ] CSV/PDF export
- [ ] Advanced analytics and charts
- [ ] Subscription tiers
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app (PWA)

## Security Considerations

- Always use strong JWT secrets in production
- Enable HTTPS in production
- Implement rate limiting
- Validate all user inputs
- Use environment variables for sensitive data
- Regularly update dependencies

## License

This project is open source and available for personal and commercial use.

## Support

For issues and questions, please open an issue on the repository.


