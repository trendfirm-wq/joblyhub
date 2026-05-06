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
      required: true,
    },

    option: {
      type: String,
      required: true,
      enum: [
        'Actively looking',
        'Open to opportunities',
        'Not looking',
        'Just browsing',
      ],
    },
  },
  { timestamps: true }
);

pollVoteSchema.index({ pollKey: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('PollVote', pollVoteSchema);