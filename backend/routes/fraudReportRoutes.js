const express = require('express');

const {
  createFraudReport,
  getFraudReportsForAdmin,
} = require('../controllers/fraudReportController');

const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createFraudReport);

router.get(
  '/admin/all',
  protect,
  allowRoles('admin'),
  getFraudReportsForAdmin
);

module.exports = router;