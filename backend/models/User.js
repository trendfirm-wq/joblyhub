const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: '',
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ['admin', 'employer', 'job_seeker'],
      default: 'job_seeker',
    },

    // Employer Information
    companyName: {
      type: String,
      default: '',
      trim: true,
    },

    companyIndustry: {
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

    companyLogo: {
      type: String,
      default: '',
    },
jobPostCode: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'JobPostCode',
},
canPostFree: {
  type: Boolean,
  default: false,
},
    // Job Seeker Profile
    location: {
      type: String,
      default: '',
      trim: true,
    },

    preferredJobCategory: {
      type: String,
      default: '',
      trim: true,
    },

    highestQualification: {
      type: String,
      default: '',
      trim: true,
    },

    experienceLevel: {
      type: String,
      enum: ['', 'Entry Level', 'Junior', 'Mid-Level', 'Senior'],
      default: '',
    },

    resumeUrl: {
      type: String,
      default: '',
    },

    agreedToTerms: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
isEmployerVerified: {
  type: Boolean,
  default: false,
},

employerVerificationStatus: {
  type: String,
  enum: ['not_submitted', 'pending', 'verified', 'rejected'],
  default: 'not_submitted',
},

employerVerificationNote: {
  type: String,
  default: '',
},
    // Security / session tracking
    lastLoginAt: {
      type: Date,
    },

    lastLoginIp: {
      type: String,
      default: '',
    },

    lastLoginUserAgent: {
      type: String,
      default: '',
    },

    passwordChangedAt: {
      type: Date,
    },

    tokenVersion: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: {
  type: String,
  default: '',
},

resetPasswordExpires: {
  type: Date,
},
loginOtpCode: {
  type: String,
  default: '',
},

loginOtpExpires: {
  type: Date,
},

twoFactorEnabled: {
  type: Boolean,
  default: true,
},
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.passwordChangedAt = new Date();
  this.tokenVersion += 1;
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);