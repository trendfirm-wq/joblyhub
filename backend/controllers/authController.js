const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    ''
  );
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
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide name, email and password',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match',
      });
    }

    if (!agreedToTerms) {
      return res.status(400).json({
        message: 'You must agree to the Terms of Use and Privacy Policy',
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const allowedRoles = ['employer', 'job_seeker'];
    let selectedRole = 'job_seeker';

    if (role && allowedRoles.includes(role)) {
      selectedRole = role;
    }

    if (selectedRole === 'employer') {
      if (!companyName || !companyIndustry) {
        return res.status(400).json({
          message: 'Company name and company industry are required',
        });
      }
    }

    if (selectedRole === 'job_seeker') {
      if (
        !phone ||
        !location ||
        !preferredJobCategory ||
        !highestQualification ||
        !experienceLevel
      ) {
        return res.status(400).json({
          message:
            'Phone, location, preferred job category, highest qualification and experience level are required',
        });
      }
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
      companyDescription:
        selectedRole === 'employer' ? companyDescription || '' : '',
      companyLogo: selectedRole === 'employer' ? companyLogo || '' : '',

      location: selectedRole === 'job_seeker' ? location || '' : '',
      preferredJobCategory:
        selectedRole === 'job_seeker' ? preferredJobCategory || '' : '',
      highestQualification:
        selectedRole === 'job_seeker' ? highestQualification || '' : '',
      experienceLevel:
        selectedRole === 'job_seeker' ? experienceLevel || '' : '',
      resumeUrl: selectedRole === 'job_seeker' ? resumeUrl || '' : '',

      agreedToTerms: Boolean(agreedToTerms),
    });

    console.log('USER REGISTERED:', {
      userId: user._id,
      email: user.email,
      role: user.role,
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'] || '',
      time: new Date().toISOString(),
    });

    res.status(201).json(formatUserResponse(user));
  } catch (error) {
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
      return res.status(400).json({
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: 'Your account has been disabled',
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log('FAILED LOGIN ATTEMPT:', {
        email,
        ip: getClientIp(req),
        userAgent: req.headers['user-agent'] || '',
        time: new Date().toISOString(),
      });

      return res.status(401).json({
        message: 'Invalid email or password',
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

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

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
      if (companyDescription !== undefined) {
        user.companyDescription = companyDescription;
      }
    }

    if (user.role === 'job_seeker' || user.role === 'admin') {
      if (location !== undefined) user.location = location;
      if (preferredJobCategory !== undefined) {
        user.preferredJobCategory = preferredJobCategory;
      }
      if (highestQualification !== undefined) {
        user.highestQualification = highestQualification;
      }
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

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};