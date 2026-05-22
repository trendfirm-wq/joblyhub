// models/JobPostCode.js

const mongoose = require('mongoose');

const jobPostCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    amount: {
      type: Number,
      default: 55,
    },

    paymentReference: {
      type: String,
      required: true,
      trim: true,
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },

    isUsed: {
      type: Boolean,
      default: false,
    },

    usedForJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      default: null,
    },

    usedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JobPostCode', jobPostCodeSchema);