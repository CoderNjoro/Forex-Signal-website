const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  updatePassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth.middleware');
const { handleValidationErrors } = require('../middleware/validation.middleware');

router.get('/profile', protect, getProfile);

router.put(
  '/profile',
  protect,
  [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    handleValidationErrors,
  ],
  updateProfile
);

router.put(
  '/password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
    handleValidationErrors,
  ],
  updatePassword
);

module.exports = router;


