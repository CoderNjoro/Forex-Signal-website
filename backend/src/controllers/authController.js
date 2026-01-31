const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const logActivity = require('../utils/activityLogger');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      // Log registration activity
      await logActivity({
        userId: user._id,
        action: 'register',
        details: 'New user registration',
        req,
      });

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscriptionType: user.subscriptionType,
        isAdminBlocked: user.isAdminBlocked,
        canCreatePromotions: user.canCreatePromotions,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Update last login
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      // Check if blocked admin
      if (user.role === 'admin' && user.isAdminBlocked) {
        return res.status(403).json({ message: 'Your admin access has been blocked. Please contact the superadmin.' });
      }

      // Log login activity
      await logActivity({
        userId: user._id,
        action: 'login',
        details: 'User logged in',
        req,
      });

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscriptionType: user.subscriptionType,
        isAdminBlocked: user.isAdminBlocked,
        canCreatePromotions: user.canCreatePromotions,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      subscriptionType: user.subscriptionType,
      isAdminBlocked: user.isAdminBlocked,
      canCreatePromotions: user.canCreatePromotions,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


