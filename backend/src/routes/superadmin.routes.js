const express = require('express');
const router = express.Router();
const {
  getAdmins,
  createAdmin,
  toggleAdminBlock,
  togglePromotionPermission,
  getOverview,
} = require('../controllers/superAdminController');
const { protect } = require('../middleware/auth.middleware');
const { superadmin } = require('../middleware/superadmin.middleware');

// All routes here require superadmin privileges
router.use(protect, superadmin);

router.get('/admins', getAdmins);
router.post('/admins', createAdmin);
router.patch('/admins/:id/block', toggleAdminBlock);
router.patch('/admins/:id/promotion-perm', togglePromotionPermission);
router.get('/overview', getOverview);

module.exports = router;
