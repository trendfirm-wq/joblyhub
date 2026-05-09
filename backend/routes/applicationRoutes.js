const express = require('express');
const multer = require('multer');

const {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  getAllApplicationsForAdmin,
  updateApplicationStatus,
  logPdfAccess,
} = require('../controllers/applicationController');

const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.memoryStorage();

const uploadApplicationPdf = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }

    cb(null, true);
  },
});

// Job seeker applies to a job with one PDF document
router.post(
  '/:jobId/apply',
  protect,
  allowRoles('job_seeker', 'admin'),
  uploadApplicationPdf.single('applicationPdf'),
  applyForJob
);

// Job seeker views own applications
router.get(
  '/my-applications',
  protect,
  allowRoles('job_seeker', 'admin'),
  getMyApplications
);

// Employer views applications for their jobs
router.get(
  '/employer',
  protect,
  allowRoles('employer', 'admin'),
  getEmployerApplications
);

// Admin views all applications
router.get(
  '/admin/all',
  protect,
  allowRoles('admin'),
  getAllApplicationsForAdmin
);
// Employer/Admin logs PDF access
router.post(
  '/:id/log-pdf-access',
  protect,
  allowRoles('employer', 'admin'),
  logPdfAccess
);
// Employer/Admin updates application status
router.put(
  '/:id/status',
  protect,
  allowRoles('employer', 'admin'),
  updateApplicationStatus
);

module.exports = router;