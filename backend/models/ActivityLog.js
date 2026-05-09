const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    email: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      default: '',
      trim: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    route: {
      type: String,
      default: '',
      trim: true,
    },

    ip: {
      type: String,
      default: '',
      trim: true,
    },

    userAgent: {
      type: String,
      default: '',
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);