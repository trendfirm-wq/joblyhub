const PollVote = require('../models/PollVote');

const HOME_JOB_STATUS_POLL = 'home-job-status';

const pollOptions = [
  'Actively looking',
  'Open to opportunities',
  'Not looking',
  'Just browsing',
];

const getHomeJobStatusPoll = async (req, res) => {
  try {
    const votes = await PollVote.find({ pollKey: HOME_JOB_STATUS_POLL });

    const results = pollOptions.reduce((acc, option) => {
      acc[option] = 0;
      return acc;
    }, {});

    votes.forEach((vote) => {
      if (results[vote.option] !== undefined) {
        results[vote.option] += 1;
      }
    });

    let userVote = '';

    if (req.user?._id) {
      const existingVote = await PollVote.findOne({
        pollKey: HOME_JOB_STATUS_POLL,
        user: req.user._id,
      });

      userVote = existingVote?.option || '';
    }

    res.json({
      success: true,
      pollKey: HOME_JOB_STATUS_POLL,
      options: pollOptions,
      results,
      totalVotes: votes.length,
      userVote,
    });
  } catch (error) {
    console.error('Get poll error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to load poll results',
    });
  }
};

const voteHomeJobStatusPoll = async (req, res) => {
  try {
    const { option } = req.body;

    if (!pollOptions.includes(option)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid poll option',
      });
    }

    await PollVote.findOneAndUpdate(
      {
        pollKey: HOME_JOB_STATUS_POLL,
        user: req.user._id,
      },
      {
        pollKey: HOME_JOB_STATUS_POLL,
        user: req.user._id,
        option,
      },
      {
        upsert: true,
        returnDocument: 'after',
        runValidators: true,
      }
    );

    const votes = await PollVote.find({ pollKey: HOME_JOB_STATUS_POLL });

    const results = pollOptions.reduce((acc, item) => {
      acc[item] = 0;
      return acc;
    }, {});

    votes.forEach((vote) => {
      if (results[vote.option] !== undefined) {
        results[vote.option] += 1;
      }
    });

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      results,
      totalVotes: votes.length,
      userVote: option,
    });
  } catch (error) {
    console.error('Poll vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to record vote',
    });
  }
};

module.exports = {
  getHomeJobStatusPoll,
  voteHomeJobStatusPoll,
};