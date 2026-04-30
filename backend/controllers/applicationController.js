const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Job seeker applies for a job
// @route   POST /api/applications/:jobId/apply
// @access  Job Seeker
const applyForJob = async (req, res) => {
  try {
    const { fullName, email, phone, coverLetter, resumeLink } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        message: 'Full name and email are required',
      });
    }

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    if (job.status !== 'approved' || !job.isActive) {
      return res.status(400).json({
        message: 'You can only apply to approved active jobs',
      });
    }

    const existingApplication = await Application.findOne({
      job: job._id,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: 'You have already applied for this job',
      });
    }

    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      fullName,
      email,
      phone: phone || '',
      coverLetter: coverLetter || '',
      resumeLink: resumeLink || '',
      status: 'submitted',
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to submit application',
      error: error.message,
    });
  }
};

// @desc    Job seeker views own applications
// @route   GET /api/applications/my-applications
// @access  Job Seeker
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate('job', 'title companyName location jobType category salary status');

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch your applications',
      error: error.message,
    });
  }
};

// @desc    Employer views applications for jobs they own
// @route   GET /api/applications/employer
// @access  Employer/Admin
const getEmployerApplications = async (req, res) => {
  try {
    const employerJobs = await Job.find({ employer: req.user._id }).select('_id');

    const jobIds = employerJobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .sort({ createdAt: -1 })
      .populate('job', 'title companyName location jobType category')
      .populate('applicant', 'name email phone');

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch employer applications',
      error: error.message,
    });
  }
};

// @desc    Admin views all applications
// @route   GET /api/applications/admin/all
// @access  Admin
const getAllApplicationsForAdmin = async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .populate('job', 'title companyName location jobType category')
      .populate('applicant', 'name email phone');

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch all applications',
      error: error.message,
    });
  }
};

// @desc    Employer/Admin updates application status
// @route   PUT /api/applications/:id/status
// @access  Employer/Admin
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['submitted', 'reviewed', 'shortlisted', 'rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid application status',
      });
    }

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    const isAdmin = req.user.role === 'admin';
    const isJobOwner =
      application.job.employer.toString() === req.user._id.toString();

    if (!isAdmin && !isJobOwner) {
      return res.status(403).json({
        message: 'You are not allowed to update this application',
      });
    }

    application.status = status;

    const updatedApplication = await application.save();

    res.json({
      message: 'Application status updated successfully',
      application: updatedApplication,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update application status',
      error: error.message,
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  getAllApplicationsForAdmin,
  updateApplicationStatus,
};