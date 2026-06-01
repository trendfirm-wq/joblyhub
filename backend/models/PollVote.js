const mongoose = require('mongoose');

const pollVoteSchema = new mongoose.Schema(
  {
    pollKey: {
      type: String,
      required: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    guestId: {
      type: String,
      default: '',
      trim: true,
    },

    option: {
      type: String,
      required: true,
      enum: [
        'Less than 1 month',
        '1–3 months',
        '3–6 months',
        'Over 6 months',
      ],
    },
  },
  { timestamps: true }
);

pollVoteSchema.index(
  { pollKey: 1, user: 1 },
  {
    unique: true,
    partialFilterExpression: {
      user: { $type: 'objectId' },
    },
  }
);

pollVoteSchema.index(
  { pollKey: 1, guestId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      guestId: { $type: 'string', $ne: '' },
    },
  }
);

module.exports = mongoose.model('PollVote', pollVoteSchema);