const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUser,
  deleteUser,
  getStats,
  getPerformance,
  getActivityLogs,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

router.get('/users', protect, admin, getUsers);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/stats', protect, admin, getStats);
router.get('/performance', protect, admin, getPerformance);
router.get('/activity', protect, admin, getActivityLogs);

module.exports = router;


