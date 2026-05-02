const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 1. Basic Job Information
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },

    category: {
      type: String,
      enum: [
        'Technology & IT',
        'Business, Administration & Customer Service',
        'Sales & Marketing',
        'Finance & Accounting',
        'Engineering & Technical',
        'Healthcare & Medical',
        'Education & Training',
        'Transport & Logistics',
        'Skilled Trades',
        'Hospitality, Travel & Services',
        'Creative & Design',
        'NGO & Development',
      ],
      required: [true, 'Category is required'],
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },

    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      required: [true, 'Job type is required'],
    },

   salary: {
  type: String,
  default: '',
  trim: true,
},

companyLogo: {
  type: String,
  default: '',
},

companyLogoPublicId: {
  type: String,
  default: '',
},

deadline: {
  type: Date,
},

    // 2. Company Information
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },

    industry: {
      type: String,
      default: '',
      trim: true,
    },

    companyWebsite: {
      type: String,
      default: '',
      trim: true,
    },

    companyDescription: {
      type: String,
      default: '',
    },

    // 3. Job Details
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },

    responsibilities: {
      type: String,
      default: '',
    },

    requirements: {
      type: String,
      default: '',
    },

    // 4. How to Apply
    applicationMethod: {
      type: String,
      enum: ['email', 'link', 'platform'],
      required: true,
    },

    applicationEmail: {
      type: String,
      default: '',
      trim: true,
    },

    applicationLink: {
      type: String,
      default: '',
      trim: true,
    },

    applicationInstructions: {
      type: String,
      default: '',
    },

    // 5. Employer Contact Details — admin/employer dashboard only
    contactName: {
      type: String,
      default: '',
      trim: true,
    },

    contactEmail: {
      type: String,
      default: '',
      trim: true,
    },

    contactPhone: {
      type: String,
      default: '',
      trim: true,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    rejectionReason: {
      type: String,
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);