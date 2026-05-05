const User = require('../models/User');

// @desc    Admin gets user statistics
// @route   GET /api/users/admin/stats
// @access  Admin
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const jobSeekers = await User.countDocuments({
      role: 'job_seeker',
    });

    const employers = await User.countDocuments({
      role: 'employer',
    });

    const admins = await User.countDocuments({
      role: 'admin',
    });

    res.json({
      totalUsers,
      jobSeekers,
      employers,
      admins,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch user statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getUserStats,
};