const express = require('express');
const router = express.Router();
const { getSettings } = require('../controllers/settingsController');

// Public route to get settings (for subscription page)
router.get('/', getSettings);

module.exports = router;
