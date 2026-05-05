const express = require('express');

const { getUserStats } = require('../controllers/userController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/admin/stats', protect, allowRoles('admin'), getUserStats);

module.exports = router;