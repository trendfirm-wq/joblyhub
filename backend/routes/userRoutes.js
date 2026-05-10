const express = require('express');

const {
  getUserStats,
  getActivityLogsForAdmin,
} = require('../controllers/userController');

const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/admin/stats', protect, allowRoles('admin'), getUserStats);
router.get('/admin/activity-logs', protect, allowRoles('admin'), getActivityLogsForAdmin);

module.exports = router;