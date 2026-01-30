const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getComments,
  addComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth.middleware');
const { handleValidationErrors } = require('../middleware/validation.middleware');

router.get('/signal/:signalId', protect, getComments);

router.post(
  '/',
  protect,
  [
    body('content').notEmpty().withMessage('Comment content is required').trim(),
    body('signalId').notEmpty().withMessage('Signal ID is required'),
    handleValidationErrors,
  ],
  addComment
);

router.delete('/:id', protect, deleteComment);

module.exports = router;
