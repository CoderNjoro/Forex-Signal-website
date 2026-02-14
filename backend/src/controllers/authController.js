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

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ 
        message: 'If an account with that email exists, a password reset code has been sent.' 
      });
    }

    // Generate reset token (6-digit code)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash token and set to resetPasswordToken field
    const crypto = require('crypto');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire time (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Send email with reset code
    try {
      const { sendPasswordResetEmail } = require('../services/emailService');
      await sendPasswordResetEmail(user.email, resetToken);
      console.log(`✅ Password reset email sent to ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError.message);
      // Continue anyway - user might not have email configured
      // In development, show the token
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔑 Password reset token for ${email}: ${resetToken}`);
      }
    }

    // Log activity
    await logActivity({
      userId: user._id,
      action: 'forgot_password',
      details: 'Password reset requested',
      req,
    });

    res.json({ 
      message: 'If an account with that email exists, a password reset code has been sent.',
      // REMOVE THIS IN PRODUCTION - only for development
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ message: 'Please provide email, reset token, and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash the provided token to compare with stored hash
    const crypto = require('crypto');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Log activity
    await logActivity({
      userId: user._id,
      action: 'reset_password',
      details: 'Password reset successfully',
      req,
    });

    res.json({ 
      message: 'Password reset successful. You can now log in with your new password.',
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

