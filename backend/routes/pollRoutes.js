const express = require('express');

const {
  getHomeJobStatusPoll,
  voteHomeJobStatusPoll,
} = require('../controllers/pollController');

const { protectOptional } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/home-job-status', protectOptional, getHomeJobStatusPoll);
router.post('/home-job-status/vote', protectOptional, voteHomeJobStatusPoll);

module.exports = router;