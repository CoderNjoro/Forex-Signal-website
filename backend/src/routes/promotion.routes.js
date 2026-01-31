const express = require('express');
const router = express.Router();
const {
  getPromotions,
  getAllPromotionsAdmin,
  createPromotion,
  updatePromotion,
  deletePromotion,
  optInPromotion,
  getPromotionOptIns,
} = require('../controllers/promotionController');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');
const multer = require('multer');
const path = require('path');

// Configure upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'promo-' + Date.now() + path.extname(file.originalname));
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

// User routes
router.get('/', protect, getPromotions);
router.post('/:id/opt-in', protect, optInPromotion);

// Admin routes
router.get('/admin', protect, admin, getAllPromotionsAdmin);
router.get('/:id/opt-ins', protect, admin, getPromotionOptIns);
router.post('/', protect, admin, upload.single('image'), createPromotion);
router.put('/:id', protect, admin, upload.single('image'), updatePromotion);
router.delete('/:id', protect, admin, deletePromotion);

module.exports = router;
