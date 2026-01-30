const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getSignals,
  getSignal,
  createSignal,
  updateSignal,
  deleteSignal,
  getActiveSignals,
  updateTPHit,
  markSLHit,
  markBreakeven,
  closeSignal,
  getSignalStats,
  voteSignal,
} = require('../controllers/signalController');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');
const { handleValidationErrors } = require('../middleware/validation.middleware');

const multer = require('multer');
const path = require('path');

// Configure upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

router.get('/active', protect, getActiveSignals);
router.get('/stats', protect, getSignalStats);
router.get('/', protect, getSignals);
router.get('/:id', protect, getSignal);
router.put('/:id/vote', protect, voteSignal);

router.post(
  '/',
  protect,
  admin,
  upload.single('chartImage'),
  [
    body('pair').notEmpty().withMessage('Currency pair is required'),
    body('type').isIn(['buy', 'sell', 'buy limit', 'sell limit']).withMessage('Invalid signal type'),
    body('entryPrice').isFloat().withMessage('Entry price must be a number'),
    body('stopLoss').isFloat().withMessage('Stop loss must be a number'),
    body('takeProfit')
      .custom((value, { req }) => {
        // Handle array sent as form-data (might come as individual fields or array)
        // If it comes from FormData, it might be an array of strings or a single string
        if (Array.isArray(value)) return value.length >= 1;
        if (typeof value === 'string') return true; 
        // Fallback for when express-validator tries to parse before multer (though here multer is first)
        // Actually, with multipart/form-data, arrays like takeProfit[0], takeProfit[1] 
        // need careful handling or simple "takeProfit" key with multiple values.
        return true; 
      }),
    handleValidationErrors,
  ],
  createSignal
);

router.put(
  '/:id',
  protect,
  admin,
  [
    body('status')
      .optional()
      .isIn(['active', 'closed', 'cancelled'])
      .withMessage('Invalid status'),
    body('result')
      .optional()
      .isIn(['win', 'loss', 'breakeven', 'pending'])
      .withMessage('Invalid result'),
    handleValidationErrors,
  ],
  updateSignal
);

router.put('/:id/tp-hit', protect, admin, updateTPHit);
router.put('/:id/sl-hit', protect, admin, markSLHit);
router.put('/:id/breakeven', protect, admin, markBreakeven);
router.put('/:id/close', protect, admin, closeSignal);

router.delete('/:id', protect, admin, deleteSignal);

module.exports = router;


