const express = require('express');
const router = express.Router();
const { 
    initiateMpesaPayment, 
    mpesaCallback, 
    initiateCryptoPayment, 
    confirmCryptoPayment 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Configure multer for screenshot uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/payments/');
  },
  filename: function (req, file, cb) {
    cb(null, `payment-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

router.post('/mpesa', protect, initiateMpesaPayment);
router.post('/mpesa-callback', mpesaCallback);
router.post('/crypto', protect, initiateCryptoPayment);
router.post('/crypto/confirm', protect, upload.single('screenshot'), confirmCryptoPayment);

module.exports = router;
