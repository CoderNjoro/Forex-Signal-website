const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(); // Guest/Anonymous

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('role subscriptionType');
      if (user) {
        socket.user = user;
      }
      next();
    } catch (err) {
      next(); // Continue as anonymous if token invalid
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join appropriate room
    if (socket.user) {
      if (socket.user.role === 'admin' || socket.user.subscriptionType === 'premium') {
        socket.join('premium');
        console.log(`User ${socket.id} joined premium room`);
      } 
      
      if (socket.user.role === 'admin') {
        socket.join('admin');
        console.log(`User ${socket.id} joined admin room`);
      }

      if (socket.user.role !== 'admin' && socket.user.subscriptionType !== 'premium') {
        socket.join('free');
        console.log(`User ${socket.id} joined free room`);
      }
    } else {
      socket.join('free');
    }

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };


