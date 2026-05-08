const mongoose = require('mongoose');

const JOB_CATEGORIES = [
  'Technology & IT',
  'Business & Administration',
  'Sales & Marketing',
  'Engineering & Technical',
  'Healthcare & Medical',
  'Education & Training',
  'Customer Service & Support',
  'Transport & Logistics',
  'Skilled Trades & Artisans',
  'Hospitality & Tourism',
  'Finance & Accounting',
  'Human Resources & Recruitment',
  'Legal & Compliance',
  'Creative & Design',
  'Media & Communications',
  'Security Services',
  'Agriculture & Farming',
  'Construction & Real Estate',
  'Project Management',
  'General & Other Jobs',
];

const INDUSTRIES = [
  'Technology & Software',
  'Telecommunications',
  'Banking & Financial Services',
  'Insurance',
  'Accounting & Audit',
  'Manufacturing & Production',
  'Construction & Infrastructure',
  'Real Estate & Property',
  'Retail & E-commerce',
  'Wholesale & Distribution',
  'Transportation & Logistics',
  'Energy & Utilities (Oil, Gas, Power)',
  'Mining & Natural Resources',
  'Agriculture & Agribusiness',
  'Healthcare & Pharmaceuticals',
  'Education & Training',
  'Hospitality & Tourism',
  'Media & Entertainment',
  'Marketing & Advertising',
  'Consulting & Professional Services',
  'Legal Services',
  'Government & Public Sector',
  'NGO & Non-Profit',
  'Security Services',
  'Automotive Industry',
  'Environmental & Waste Management',
  'Import & Export / Trading',
  'Human Resources Services',
  'Research & Development',
  'Other Industries',
];

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
  required: [true, 'Category is required'],
  trim: true,
},
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },

    jobType: {
  type: String,
  enum: [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Remote',
    'Hybrid',
  ],
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

    additionalInformation: {
      type: String,
      default: '',
    },

    applicationMethod: {
      type: String,
      enum: ['email', 'website', 'joblyhub'],
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
views: {
  type: Number,
  default: 0,
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