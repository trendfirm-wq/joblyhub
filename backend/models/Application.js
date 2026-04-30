const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: '',
      trim: true,
    },

    coverLetter: {
      type: String,
      default: '',
    },

    resumeLink: {
      type: String,
      default: '',
      trim: true,
    },

    status: {
      type: String,
      enum: ['submitted', 'reviewed', 'shortlisted', 'rejected'],
      default: 'submitted',
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);