const express = require('express');
const router = express.Router();
const {
  getAdmins,
  createAdmin,
  toggleAdminBlock,
  togglePromotionPermission,
  getOverview,
  getSubscriptions
} = require('../controllers/superAdminController');
const { updateSubscriptionPrice, updateCryptoSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth.middleware');
const { superadmin } = require('../middleware/superadmin.middleware');

// All routes here require superadmin privileges
router.use(protect, superadmin);

router.get('/admins', getAdmins);
router.post('/admins', createAdmin);
router.patch('/admins/:id/block', toggleAdminBlock);
router.patch('/admins/:id/promotion-perm', togglePromotionPermission);
router.get('/overview', getOverview);
router.get('/subscriptions', getSubscriptions);
router.put('/settings/subscription-price', updateSubscriptionPrice);
router.put('/settings/crypto', updateCryptoSettings);

module.exports = router;
