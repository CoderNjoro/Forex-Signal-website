const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth.middleware');
const { handleValidationErrors } = require('../middleware/validation.middleware');

router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    handleValidationErrors,
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
  ],
  login
);

router.get('/me', protect, getMe);

// Password reset routes
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    handleValidationErrors,
  ],
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('resetToken').notEmpty().withMessage('Reset token is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    handleValidationErrors,
  ],
  resetPassword
);

// TEMPORARY ENDPOINT - Remove after creating superadmin in production
// This endpoint creates the superadmin account if it doesn't exist
router.post('/initialize-superadmin', async (req, res) => {
  try {
    const { secretKey } = req.body;
    
    // Security check - require a secret key from environment
    const expectedSecret = process.env.SUPERADMIN_INIT_SECRET || 'CHANGE_THIS_SECRET_KEY_123';
    
    if (secretKey !== expectedSecret) {
      console.log('❌ Invalid secret key attempt');
      return res.status(403).json({ 
        success: false,
        message: 'Invalid secret key' 
      });
    }

    const User = require('../models/User');
    const bcrypt = require('bcryptjs');

    // Check if superadmin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'admin@forex.com' },
        { username: 'superadmin' }
      ]
    });

    if (existingAdmin) {
      console.log('⚠️  User already exists:', existingAdmin.email);
      
      // Update/Fix existing account
      console.log('🔄 Updating existing user permissions and resetting password...');
      existingAdmin.role = 'superadmin';
      existingAdmin.canCreatePromotions = true;
      existingAdmin.subscriptionType = 'premium';
      existingAdmin.isActive = true;
      existingAdmin.isAdminBlocked = false;
      
      // RESET PASSWORD to plain text (Model pre-save hook will hash it)
      existingAdmin.password = 'Admin@123';
      
      await existingAdmin.save();
      
      return res.json({ 
        success: true,
        message: 'Superadmin updated successfully. Password reset to: Admin@123',
        email: existingAdmin.email,
        username: existingAdmin.username,
        warning: 'Please change the default password (Admin@123) immediately!'
      });
    }

    // Create new superadmin with PLAIN TEXT password
    // The User model pre-save hook will handle hashing automatically
    console.log('👤 Creating new superadmin account...');

    const superadmin = await User.create({
      username: 'superadmin',
      email: 'admin@forex.com',
      password: 'Admin@123', // Plain text -> Model hashes it
      role: 'superadmin',
      subscriptionType: 'premium',
      canCreatePromotions: true,
      isActive: true,
      isAdminBlocked: false,
    });

    console.log('✅ Superadmin created successfully!');
    
    res.json({ 
      success: true,
      message: 'Superadmin created successfully',
      email: superadmin.email,
      username: superadmin.username,
      warning: 'Please change the default password (Admin@123) immediately!'
    });
  } catch (error) {
    console.error('❌ Error creating superadmin:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating superadmin',
      error: error.message 
    });
  }
});


module.exports = router;


