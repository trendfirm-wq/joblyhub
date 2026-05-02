const express = require('express');
const multer = require('multer');

const {
  createJob,
  getApprovedJobs,
  getJobById,
  getEmployerJobById,
  getMyJobs,
  getAllJobsForAdmin,
  approveJob,
  rejectJob,
  updateJob,
  deleteJob,
  updateJobStatus,
} = require('../controllers/jobController');

const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

/* =========================
   Multer upload setup
========================= */

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and WEBP images are allowed.'));
    }

    cb(null, true);
  },
});

/* =========================
   Public routes
========================= */

router.get('/', getApprovedJobs);

/* =========================
   Employer routes
========================= */

router.post(
  '/',
  protect,
  allowRoles('employer', 'admin'),
  upload.single('companyLogo'),
  createJob
);

router.get(
  '/my-jobs',
  protect,
  allowRoles('employer', 'admin'),
  getMyJobs
);

router.get(
  '/employer/:id',
  protect,
  allowRoles('employer', 'admin'),
  getEmployerJobById
);

/* =========================
   Admin routes
========================= */

router.get(
  '/admin/all',
  protect,
  allowRoles('admin'),
  getAllJobsForAdmin
);

router.patch(
  '/admin/:id/status',
  protect,
  allowRoles('admin'),
  updateJobStatus
);

router.put(
  '/admin/:id/approve',
  protect,
  allowRoles('admin'),
  approveJob
);

router.put(
  '/admin/:id/reject',
  protect,
  allowRoles('admin'),
  rejectJob
);

/* =========================
   Employer/Admin routes
========================= */

router.put(
  '/:id',
  protect,
  allowRoles('employer', 'admin'),
  upload.single('companyLogo'),
  updateJob
);

router.delete(
  '/:id',
  protect,
  allowRoles('employer', 'admin'),
  deleteJob
);

/* =========================
   Public single job route
   Keep this last
========================= */

router.get('/:id', getJobById);

module.exports = router;