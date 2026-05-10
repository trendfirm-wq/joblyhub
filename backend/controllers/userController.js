const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

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
const getActivityLogsForAdmin = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalLogs = await ActivityLog.countDocuments();

    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      logs,
      page,
      limit,
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch activity logs',
      error: error.message,
    });
  }
};
module.exports = {
  getUserStats,
  getActivityLogsForAdmin,
};