const PollVote = require('../models/PollVote');

const HOME_JOB_HUNTING_DURATION_POLL = 'home-job-hunting-duration';

const pollOptions = [
  'Less than 1 month',
  '1–3 months',
  '3–6 months',
  'Over 6 months',
];

const buildResults = (votes) => {
  const results = pollOptions.reduce((acc, option) => {
    acc[option] = 0;
    return acc;
  }, {});

  votes.forEach((vote) => {
    if (results[vote.option] !== undefined) {
      results[vote.option] += 1;
    }
  });

  return results;
};

const getHomeJobHuntingDurationPoll = async (req, res) => {
  try {
    const guestId = req.query.guestId || '';

    const votes = await PollVote.find({
      pollKey: HOME_JOB_HUNTING_DURATION_POLL,
    });

    let userVote = '';

    if (req.user?._id) {
      const existingVote = await PollVote.findOne({
        pollKey: HOME_JOB_HUNTING_DURATION_POLL,
        user: req.user._id,
      });

      userVote = existingVote?.option || '';
    } else if (guestId) {
      const existingVote = await PollVote.findOne({
        pollKey: HOME_JOB_HUNTING_DURATION_POLL,
        guestId,
      });

      userVote = existingVote?.option || '';
    }

    res.json({
      success: true,
      pollKey: HOME_JOB_HUNTING_DURATION_POLL,
      options: pollOptions,
      results: buildResults(votes),
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

const voteHomeJobHuntingDurationPoll = async (req, res) => {
  try {
    const { option, guestId } = req.body;

    if (!pollOptions.includes(option)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid poll option',
      });
    }

    if (!req.user?._id && !guestId) {
      return res.status(400).json({
        success: false,
        message: 'Unable to identify voter',
      });
    }

    const filter = req.user?._id
      ? {
          pollKey: HOME_JOB_HUNTING_DURATION_POLL,
          user: req.user._id,
        }
      : {
          pollKey: HOME_JOB_HUNTING_DURATION_POLL,
          guestId,
        };

    const update = req.user?._id
      ? {
          pollKey: HOME_JOB_HUNTING_DURATION_POLL,
          user: req.user._id,
          guestId: '',
          option,
        }
      : {
          pollKey: HOME_JOB_HUNTING_DURATION_POLL,
          user: null,
          guestId,
          option,
        };

    await PollVote.findOneAndUpdate(filter, update, {
      upsert: true,
      returnDocument: 'after',
      runValidators: true,
    });

    const votes = await PollVote.find({
      pollKey: HOME_JOB_HUNTING_DURATION_POLL,
    });
k
    res.json({
      success: true,
      message: 'Vote recorded successfully',
      results: buildResults(votes),
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
  getHomeJobHuntingDurationPoll,
  voteHomeJobHuntingDurationPoll,
};