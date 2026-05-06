const express = require('express');

const {
  getHomeJobStatusPoll,
  voteHomeJobStatusPoll,
} = require('../controllers/pollController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/home-job-status', protect, getHomeJobStatusPoll);
router.post('/home-job-status/vote', protect, voteHomeJobStatusPoll);

module.exports = router;