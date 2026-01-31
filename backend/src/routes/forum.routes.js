const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');
const ctrl = require('../controllers/forumController');

// Public-ish (authenticated) forum endpoints
router.get('/topics', protect, ctrl.listTopics);
router.post('/topics', protect, ctrl.createTopic);
router.get('/topics/:id', protect, ctrl.getTopic);
router.post('/topics/:id/replies', protect, ctrl.addReply);

// Moderation endpoints (admin or superadmin)
router.patch('/topics/:id/pin', protect, admin, ctrl.pinTopic);
router.patch('/topics/:id/lock', protect, admin, ctrl.lockTopic);

// Deletion: owner or admin/superadmin
router.delete('/topics/:id', protect, ctrl.deleteTopic);
router.delete('/topics/:id/replies/:replyId', protect, ctrl.deleteReply);

module.exports = router;