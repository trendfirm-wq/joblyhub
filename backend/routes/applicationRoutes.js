const express = require('express');

const {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  getAllApplicationsForAdmin,
  updateApplicationStatus,
} = require('../controllers/applicationController');

const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/:jobId/apply',
  protect,
  allowRoles('job_seeker', 'admin'),
  applyForJob
);

router.get(
  '/my-applications',
  protect,
  allowRoles('job_seeker', 'admin'),
  getMyApplications
);

router.get(
  '/employer',
  protect,
  allowRoles('employer', 'admin'),
  getEmployerApplications
);

router.get(
  '/admin/all',
  protect,
  allowRoles('admin'),
  getAllApplicationsForAdmin
);

router.put(
  '/:id/status',
  protect,
  allowRoles('employer', 'admin'),
  updateApplicationStatus
);

module.exports = router;