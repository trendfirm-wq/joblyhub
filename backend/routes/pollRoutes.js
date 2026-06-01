const express = require('express');

const {
  getHomeJobHuntingDurationPoll,
  voteHomeJobHuntingDurationPoll,
} = require('../controllers/pollController');

const { protectOptional } = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
  '/home-job-hunting-duration',
  protectOptional,
  getHomeJobHuntingDurationPoll
);

router.post(
  '/home-job-hunting-duration/vote',
  protectOptional,
  voteHomeJobHuntingDurationPoll
);

module.exports = router;