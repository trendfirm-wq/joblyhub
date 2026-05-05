const express = require('express');

const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getUserStats,
} = require('../controllers/authController');

const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.get('/admin/user-stats', protect, allowRoles('admin'), getUserStats);

module.exports = router;