const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ActivityLog = require('../models/ActivityLog');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    ''
  );
};
const JobPostCode = require('../models/JobPostCode');
const saveActivityLog = async (req, action, metadata = {}) => {
  try {
    await ActivityLog.create({
      user: req.user?._id || metadata.userId,
      email: req.user?.email || metadata.email || '',
      role: req.user?.role || metadata.role || '',
      action,
      route: req.originalUrl,
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'] || '',
      metadata,
    });
  } catch (error) {
    console.error('ACTIVITY LOG SAVE ERROR:', error.message);
  }
};

const formatUserResponse = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,

    companyName: user.companyName,
    companyIndustry: user.companyIndustry,
    companyWebsite: user.companyWebsite,
    companyDescription: user.companyDescription,
    companyLogo: user.companyLogo,

    isEmployerVerified: user.isEmployerVerified,
    employerVerificationStatus: user.employerVerificationStatus,
    employerVerificationNote: user.employerVerificationNote,

    location: user.location,
    preferredJobCategory: user.preferredJobCategory,
    highestQualification: user.highestQualification,
    experienceLevel: user.experienceLevel,
    resumeUrl: user.resumeUrl,

    agreedToTerms: user.agreedToTerms,
    isActive: user.isActive,

    lastLoginAt: user.lastLoginAt,
    lastLoginIp: user.lastLoginIp,
    lastLoginUserAgent: user.lastLoginUserAgent,

    createdAt: user.createdAt,
    updatedAt: user.updatedAt,

    token: generateToken(user._id, user.tokenVersion),
  };
};

const generateJobCode = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `JOBLY-${random}`;
};

const generateUniqueJobCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = generateJobCode();
    exists = await JobPostCode.findOne({ code });
  }

  return code;
};
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      phone,
      companyName,
      companyIndustry,
      companyWebsite,
      companyDescription,
      companyLogo,
      location,
      preferredJobCategory,
      highestQualification,
      experienceLevel,
      resumeUrl,
      agreedToTerms,
    } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!agreedToTerms) {
      return res.status(400).json({
        message: 'You must agree to the Terms of Use and Privacy Policy',
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const allowedRoles = ['employer', 'job_seeker'];
    let selectedRole = 'job_seeker';

    if (role && allowedRoles.includes(role)) selectedRole = role;

    if (selectedRole === 'employer' && (!companyName || !companyIndustry)) {
      return res.status(400).json({
        message: 'Company name and company industry are required',
      });
    }

    if (
      selectedRole === 'job_seeker' &&
      (!phone || !location || !preferredJobCategory || !highestQualification || !experienceLevel)
    ) {
      return res.status(400).json({
        message:
          'Phone, location, preferred job category, highest qualification and experience level are required',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: selectedRole,
      phone: phone || '',

      companyName: selectedRole === 'employer' ? companyName || '' : '',
      companyIndustry: selectedRole === 'employer' ? companyIndustry || '' : '',
      companyWebsite: selectedRole === 'employer' ? companyWebsite || '' : '',
      companyDescription: selectedRole === 'employer' ? companyDescription || '' : '',
      companyLogo: selectedRole === 'employer' ? companyLogo || '' : '',

      location: selectedRole === 'job_seeker' ? location || '' : '',
      preferredJobCategory: selectedRole === 'job_seeker' ? preferredJobCategory || '' : '',
      highestQualification: selectedRole === 'job_seeker' ? highestQualification || '' : '',
      experienceLevel: selectedRole === 'job_seeker' ? experienceLevel || '' : '',
      resumeUrl: selectedRole === 'job_seeker' ? resumeUrl || '' : '',

      agreedToTerms: Boolean(agreedToTerms),
    });
if (user.role === 'employer') {
  const freeCode = await generateUniqueJobCode();

  const createdCode = await JobPostCode.create({
    code: freeCode,
    employer: user._id,
    amount: 0,
    paymentReference: `FREE_REGISTER_${Date.now()}_${user._id}`,
    paymentStatus: 'completed',
    isUsed: false,
  });

  user.jobPostCode = createdCode._id;
  await user.save();

  console.log('FREE EMPLOYER JOB CODE CREATED:', freeCode);
}
    console.log('USER REGISTERED:', {
      userId: user._id,
      email: user.email,
      role: user.role,
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'] || '',
      time: new Date().toISOString(),
    });

    await saveActivityLog(req, 'USER_REGISTERED', {
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json(formatUserResponse(user));
  } catch (error) {
   console.error('REGISTER ERROR:', error);

res.status(500).json({
  message: 'Registration failed',
  error: error.message,
});
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      await saveActivityLog(req, 'FAILED_LOGIN_ATTEMPT', { email });

      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      await saveActivityLog(req, 'DISABLED_ACCOUNT_LOGIN_ATTEMPT', {
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      return res.status(403).json({ message: 'Your account has been disabled' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log('FAILED LOGIN ATTEMPT:', {
        email,
        ip: getClientIp(req),
        userAgent: req.headers['user-agent'] || '',
        time: new Date().toISOString(),
      });

      await saveActivityLog(req, 'FAILED_LOGIN_ATTEMPT', {
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      return res.status(401).json({ message: 'Invalid email or password' });
    }
if (
  (user.role === 'admin' || user.role === 'employer') &&
  user.twoFactorEnabled
) {
  const otpCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  user.loginOtpCode = otpCode;
  user.loginOtpExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  await sendEmail({
    to: user.email,
    subject: 'Your JoblyHub Login Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; background:#f8f5f2; padding:24px;">
        <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:18px; padding:24px; border:1px solid #eadbd5;">
          <h2 style="color:#502d55;">Login Verification</h2>

          <p>Your JoblyHub verification code is:</p>

          <div style="font-size:32px; font-weight:bold; letter-spacing:8px; margin:20px 0; color:#502d55;">
            ${otpCode}
          </div>

          <p>This code expires in 10 minutes.</p>

          <p style="margin-top:18px; color:#777; font-size:13px;">
            If this was not you, secure your account immediately.
          </p>
        </div>
      </div>
    `,
  });

  return res.json({
    requiresOtp: true,
    email: user.email,
    message: 'Verification code sent to your email.',
  });
}
    user.lastLoginAt = new Date();
    user.lastLoginIp = getClientIp(req);
    user.lastLoginUserAgent = req.headers['user-agent'] || '';

    await user.save();

    console.log('USER LOGIN:', {
      userId: user._id,
      email: user.email,
      role: user.role,
      ip: user.lastLoginIp,
      userAgent: user.lastLoginUserAgent,
      time: user.lastLoginAt.toISOString(),
    });

    await ActivityLog.create({
      user: user._id,
      email: user.email,
      role: user.role,
      action: 'USER_LOGIN',
      route: req.originalUrl,
      ip: user.lastLoginIp,
      userAgent: user.lastLoginUserAgent,
      metadata: {
        loginTime: user.lastLoginAt,
      },
    });

    res.json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};

const getMe = async (req, res) => {
  res.json(formatUserResponse(req.user));
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const {
      name,
      phone,
      companyName,
      companyIndustry,
      companyWebsite,
      companyDescription,
      location,
      preferredJobCategory,
      highestQualification,
      experienceLevel,
      resumeUrl,
    } = req.body;

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    if (user.role === 'employer' || user.role === 'admin') {
      if (companyName !== undefined) user.companyName = companyName;
      if (companyIndustry !== undefined) user.companyIndustry = companyIndustry;
      if (companyWebsite !== undefined) user.companyWebsite = companyWebsite;
      if (companyDescription !== undefined) user.companyDescription = companyDescription;
    }

    if (user.role === 'job_seeker' || user.role === 'admin') {
      if (location !== undefined) user.location = location;
      if (preferredJobCategory !== undefined) user.preferredJobCategory = preferredJobCategory;
      if (highestQualification !== undefined) user.highestQualification = highestQualification;
      if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
      if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;
    }

    const updatedUser = await user.save();

    console.log('PROFILE UPDATED:', {
      userId: updatedUser._id,
      email: updatedUser.email,
      role: updatedUser.role,
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'] || '',
      time: new Date().toISOString(),
    });

    await saveActivityLog(req, 'PROFILE_UPDATED', {
      userId: updatedUser._id,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    res.json({
      message: 'Profile updated successfully',
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};
const getEmployersForAdmin = async (req, res) => {
  try {
    const employers = await User.find({ role: 'employer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(employers);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch employers',
      error: error.message,
    });
  }
};

const verifyEmployer = async (req, res) => {
  try {
    const employer = await User.findById(req.params.id);

    if (!employer) {
      return res.status(404).json({
        message: 'Employer not found',
      });
    }

    if (employer.role !== 'employer') {
      return res.status(400).json({
        message: 'Selected user is not an employer',
      });
    }

    employer.isEmployerVerified = true;
    employer.employerVerificationStatus = 'verified';
    employer.employerVerificationNote = '';

    const updatedEmployer = await employer.save();

    await saveActivityLog(req, 'EMPLOYER_VERIFIED_BY_ADMIN', {
      employerId: updatedEmployer._id,
      employerEmail: updatedEmployer.email,
      employerCompany: updatedEmployer.companyName,
    });

    res.json({
      message: 'Employer verified successfully',
      employer: formatUserResponse(updatedEmployer),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to verify employer',
      error: error.message,
    });
  }
};

const rejectEmployer = async (req, res) => {
  try {
    const { note } = req.body;

    const employer = await User.findById(req.params.id);

    if (!employer) {
      return res.status(404).json({
        message: 'Employer not found',
      });
    }

    if (employer.role !== 'employer') {
      return res.status(400).json({
        message: 'Selected user is not an employer',
      });
    }

    employer.isEmployerVerified = false;
    employer.employerVerificationStatus = 'rejected';
    employer.employerVerificationNote = note || 'Employer verification rejected';

    const updatedEmployer = await employer.save();

    await saveActivityLog(req, 'EMPLOYER_REJECTED_BY_ADMIN', {
      employerId: updatedEmployer._id,
      employerEmail: updatedEmployer.email,
      employerCompany: updatedEmployer.companyName,
      note: updatedEmployer.employerVerificationNote,
    });

    res.json({
      message: 'Employer rejected successfully',
      employer: formatUserResponse(updatedEmployer),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to reject employer',
      error: error.message,
    });
  }
};
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: 'Please provide current password, new password and confirm password',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'New passwords do not match',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      await saveActivityLog(req, 'FAILED_PASSWORD_CHANGE_ATTEMPT', {
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      return res.status(401).json({
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    await saveActivityLog(req, 'PASSWORD_CHANGED', {
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: 'Password changed successfully. Please login again.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to change password',
      error: error.message,
    });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Please provide your email address',
      });
    }

    const user = await User.findOne({ email });

    // Do not reveal whether email exists
    if (!user) {
      return res.json({
        message:
          'If an account exists with this email, a password reset link has been sent.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const frontendUrl =
      process.env.FRONTEND_URL || 'https://joblyhub.com';

    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your JoblyHub password',
      html: `
        <div style="font-family: Arial, sans-serif; background:#f8f5f2; padding:24px;">
          <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:18px; padding:24px; border:1px solid #eadbd5;">
            <h2 style="margin:0 0 12px; color:#502d55;">Reset Your Password</h2>

            <p style="color:#555; line-height:1.6;">
              We received a request to reset your JoblyHub password.
              Click the button below to create a new password.
            </p>

            <p style="color:#555; line-height:1.6;">
              This link will expire in 15 minutes.
            </p>

            <a href="${resetUrl}"
              style="display:inline-block; background:#502d55; color:#ffffff; padding:13px 18px; border-radius:12px; text-decoration:none; font-weight:bold;">
              Reset Password
            </a>

            <p style="margin-top:18px; color:#777; font-size:13px;">
              If you did not request this, please ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    await saveActivityLog(req, 'PASSWORD_RESET_REQUESTED', {
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message:
        'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to process password reset request',
      error: error.message,
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: 'Please provide password and confirm password',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters',
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Password reset link is invalid or has expired',
      });
    }

    user.password = password;
    user.resetPasswordToken = '';
    user.resetPasswordExpires = undefined;

    await user.save();

    await saveActivityLog(req, 'PASSWORD_RESET_COMPLETED', {
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: 'Password reset successfully. Please login with your new password.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};
const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        message: 'Please provide email and verification code',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (
      user.loginOtpCode !== otpCode ||
      !user.loginOtpExpires ||
      user.loginOtpExpires < Date.now()
    ) {
      await saveActivityLog(req, 'FAILED_2FA_ATTEMPT', {
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      return res.status(401).json({
        message: 'Invalid or expired verification code',
      });
    }

    user.loginOtpCode = '';
    user.loginOtpExpires = undefined;

    user.lastLoginAt = new Date();
    user.lastLoginIp = getClientIp(req);
    user.lastLoginUserAgent =
      req.headers['user-agent'] || '';

    await user.save();

    await saveActivityLog(req, '2FA_LOGIN_SUCCESS', {
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    res.json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to verify login code',
      error: error.message,
    });
  }
};
module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  getEmployersForAdmin,
  verifyEmployer,
  rejectEmployer,
  verifyLoginOtp,
};