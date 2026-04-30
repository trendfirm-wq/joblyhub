const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Save a job
// @route   POST /api/saved-jobs/:jobId
// @access  Job Seeker/Admin
const saveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    if (job.status !== 'approved' || !job.isActive) {
      return res.status(400).json({
        message: 'You can only save approved active jobs',
      });
    }

    const alreadySaved = await SavedJob.findOne({
      job: job._id,
      user: req.user._id,
    });

    if (alreadySaved) {
      return res.status(400).json({
        message: 'Job already saved',
      });
    }

    const savedJob = await SavedJob.create({
      job: job._id,
      user: req.user._id,
    });

    res.status(201).json({
      message: 'Job saved successfully',
      savedJob,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to save job',
      error: error.message,
    });
  }
};

// @desc    Get my saved jobs
// @route   GET /api/saved-jobs/my
// @access  Job Seeker/Admin
const getMySavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate(
        'job',
        'title companyName location jobType category industry salary deadline status'
      );

    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch saved jobs',
      error: error.message,
    });
  }
};

// @desc    Remove saved job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Job Seeker/Admin
const removeSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      job: req.params.jobId,
      user: req.user._id,
    });

    if (!savedJob) {
      return res.status(404).json({
        message: 'Saved job not found',
      });
    }

    await savedJob.deleteOne();

    res.json({
      message: 'Saved job removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to remove saved job',
      error: error.message,
    });
  }
};

module.exports = {
  saveJob,
  getMySavedJobs,
  removeSavedJob,
};