const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getNews } = require('../controllers/newsController');

// Authenticated users can access fundamentals news feed
router.get('/', protect, getNews);

module.exports = router;