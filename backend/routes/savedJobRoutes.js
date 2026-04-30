const express = require('express');

const {
  saveJob,
  getMySavedJobs,
  removeSavedJob,
} = require('../controllers/savedJobController');

const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:jobId', protect, allowRoles('job_seeker', 'admin'), saveJob);

router.get('/my', protect, allowRoles('job_seeker', 'admin'), getMySavedJobs);

router.delete(
  '/:jobId',
  protect,
  allowRoles('job_seeker', 'admin'),
  removeSavedJob
);

module.exports = router;