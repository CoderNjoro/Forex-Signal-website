const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const connectDB = require('./config/database');
const config = require('./config/config');
const { initializeSocket } = require('./socket/socket');

// Connect to database
connectDB();

// Initialize Express
const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ].filter(Boolean); // Remove undefined values
    
    // Log CORS info for debugging
    if (process.env.NODE_ENV === 'production') {
      console.log('🔍 CORS Check:');
      console.log('  Request Origin:', origin);
      console.log('  FRONTEND_URL:', process.env.FRONTEND_URL);
      console.log('  Allowed Origins:', allowedOrigins);
    }
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('  ✅ Allowing request with no origin');
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('  ✅ Origin allowed:', origin);
      callback(null, true);
    } else if (process.env.NODE_ENV === 'development') {
      console.log('  ✅ Development mode - allowing origin:', origin);
      callback(null, true);
    } else {
      console.error('  ❌ CORS Error: Origin not allowed:', origin);
      console.error('  Expected FRONTEND_URL:', process.env.FRONTEND_URL);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}, Expected: ${process.env.FRONTEND_URL}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/signals', require('./routes/signal.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/superadmin', require('./routes/superadmin.routes'));
app.use('/api/comments', require('./routes/comment.routes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/promotions', require('./routes/promotion.routes'));
app.use('/api/news', require('./routes/news.routes'));
app.use('/api/forum', require('./routes/forum.routes'));
app.use('/api/settings', require('./routes/settings.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: config.nodeEnv === 'development' ? err.message : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Initialize Socket.io
initializeSocket(server);

module.exports = { app, server };


