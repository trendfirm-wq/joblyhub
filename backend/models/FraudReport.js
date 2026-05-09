const mongoose = require('mongoose');

const fraudReportSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true },

    jobTitle: { type: String, default: '', trim: true },
    companyName: { type: String, default: '', trim: true },

    scammerName: { type: String, default: '', trim: true },
    scammerPhone: { type: String, default: '', trim: true },
    scammerEmail: { type: String, default: '', trim: true },

    message: { type: String, required: true },

    status: {
      type: String,
      enum: ['new', 'reviewing', 'resolved', 'dismissed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FraudReport', fraudReportSchema);