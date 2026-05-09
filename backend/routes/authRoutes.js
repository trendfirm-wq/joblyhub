const express = require('express');

const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getEmployersForAdmin,
  verifyEmployer,
  rejectEmployer,
} = require('../controllers/authController');

const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

// Admin employer verification routes
router.get(
  '/admin/employers',
  protect,
  allowRoles('admin'),
  getEmployersForAdmin
);

router.put(
  '/admin/:id/verify-employer',
  protect,
  allowRoles('admin'),
  verifyEmployer
);

router.put(
  '/admin/:id/reject-employer',
  protect,
  allowRoles('admin'),
  rejectEmployer
);

module.exports = router;