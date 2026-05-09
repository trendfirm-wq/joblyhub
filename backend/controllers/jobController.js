const Job = require('../models/Job');
const cloudinary = require('../config/cloudinary');
const sendAdminJobAlert = require('../utils/sendAdminJobAlert');

const uploadImageToCloudinary = async (file, folder) => {
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
    'base64'
  )}`;
const detectJobRisk = (jobData = {}) => {
  const riskyKeywords = [
    'registration fee',
    'processing fee',
    'interview fee',
    'appointment letter fee',
    'medical fee',
    'training fee',
    'pay before interview',
    'pay before appointment',
    'send momo',
    'mobile money',
    'momo number',
    'whatsapp only',
    'agent fee',
    'form fee',
    'application fee',
  ];

  const content = [
    jobData.title,
    jobData.companyName,
    jobData.description,
    jobData.responsibilities,
    jobData.requirements,
    jobData.additionalInformation,
    jobData.applicationInstructions,
    jobData.contactPhone,
    jobData.contactEmail,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const matchedFlags = riskyKeywords.filter((keyword) =>
    content.includes(keyword)
  );

  return {
    riskFlags: matchedFlags,
    riskScore: matchedFlags.length,
    requiresManualReview: matchedFlags.length > 0,
  };
};
  const uploadResult = await cloudinary.uploader.upload(base64Image, {
    folder,
    resource_type: 'image',
  });

  return {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
};

// @desc    Employer creates a job
// @route   POST /api/jobs
// @access  Employer/Admin
const createJob = async (req, res) => {
  try {
    const {

      title,
      category,
      location,
      jobType,
      salary,
      deadline,

      companyName,
      industry,
      companyWebsite,
      companyDescription,

      description,
responsibilities,
requirements,
additionalInformation,

applicationMethod,
      applicationEmail,
      applicationLink,
      applicationInstructions,

      contactName,
      contactEmail,
      contactPhone,
    } = req.body;
    if (
  req.user.role === 'employer' &&
  !req.user.isEmployerVerified
) {
  return res.status(403).json({
    message:
      'Your employer account is not verified yet. Please wait for admin approval before posting jobs.',
  });
}Z

    if (
      !title ||
      !category ||
      !location ||
      !jobType ||
      !companyName ||
      !description ||
      !applicationMethod
    ) {
      return res.status(400).json({
        message:
          'Please provide title, category, location, job type, company name, description and application method',
      });
    }

    if (applicationMethod === 'email' && !applicationEmail) {
      return res.status(400).json({
        message: 'Application email is required',
      });
    }

    if (applicationMethod === 'website' && !applicationLink) {
  return res.status(400).json({
    message: 'Application website link is required',
  });
}
    let companyLogo = req.user.companyLogo || '';
    let companyLogoPublicId = req.user.companyLogoPublicId || '';

    if (req.file) {
      const uploadedLogo = await uploadImageToCloudinary(
        req.file,
        'joblyhub/job-company-logos'
      );

      companyLogo = uploadedLogo.url;
      companyLogoPublicId = uploadedLogo.publicId;
    }
const riskCheck = detectJobRisk({
  title,
  companyName,
  description,
  responsibilities,
  requirements,
  additionalInformation,
  applicationInstructions,
  contactPhone,
  contactEmail,
});
    const job = await Job.create({
      employer: req.user._id,

      title,
      category,
      location,
      jobType,
      salary: salary || '',
      deadline: deadline || null,

      companyName,
      industry: industry || '',
      companyWebsite: companyWebsite || '',
      companyDescription: companyDescription || '',

      companyLogo,
      companyLogoPublicId,
riskFlags: riskCheck.riskFlags,
riskScore: riskCheck.riskScore,
requiresManualReview: riskCheck.requiresManualReview,

      description,
responsibilities: responsibilities || '',
requirements: requirements || '',
additionalInformation: additionalInformation || '',

applicationMethod,
      applicationEmail: applicationEmail || '',
      applicationLink: applicationLink || '',
      applicationInstructions: applicationInstructions || '',

      contactName: contactName || '',
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',

      status: 'pending',
    });
sendAdminJobAlert(job).catch((emailError) => {
  console.log('Admin job alert email failed:', emailError.message);
});
    res.status(201).json({
      message: 'Job submitted successfully and is pending admin review',
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create job',
      error: error.message,
    });
  }
};

// @desc    Public users view approved jobs
// @route   GET /api/jobs
// @access  Public
const getApprovedJobs = async (req, res) => {
  try {
    const { category, location, jobType, search } = req.query;

    const filter = {
      status: 'approved',
      isActive: true,
    };

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .populate(
  'employer',
  'name email companyName isEmployerVerified employerVerificationStatus'
);

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch jobs',
      error: error.message,
    });
  }
};

// @desc    Public users view one approved job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'employer',
      'name email companyName phone'
    );

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    if (job.status !== 'approved') {
      return res.status(403).json({
        message: 'This job is not available publicly',
      });
    }

    job.views = (job.views || 0) + 1;
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch job',
      error: error.message,
    });
  }
};

// @desc    Employer views own jobs
// @route   GET /api/jobs/my-jobs
// @access  Employer/Admin
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch your jobs',
      error: error.message,
    });
  }
};

// @desc    Admin views all jobs
// @route   GET /api/jobs/admin/all
// @access  Admin
const getAllJobsForAdmin = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .populate(
  'employer',
  'name email companyName phone isEmployerVerified employerVerificationStatus'
);

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch admin jobs',
      error: error.message,
    });
  }
};

// @desc    Admin approves job
// @route   PUT /api/jobs/admin/:id/approve
// @access  Admin
const approveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    job.status = 'approved';
    job.rejectionReason = '';
    job.isActive = true;

    const updatedJob = await job.save();

    res.json({
      message: 'Job approved successfully',
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to approve job',
      error: error.message,
    });
  }
};

// @desc    Admin rejects job
// @route   PUT /api/jobs/admin/:id/reject
// @access  Admin
const rejectJob = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    job.status = 'rejected';
    job.rejectionReason = rejectionReason || 'No reason provided';

    const updatedJob = await job.save();

    res.json({
      message: 'Job rejected successfully',
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to reject job',
      error: error.message,
    });
  }
};

// @desc    Employer/Admin updates job
// @route   PUT /api/jobs/:id
// @access  Employer/Admin
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    const isOwner = job.employer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'You are not allowed to update this job',
      });
    }

    const fields = [
      'title',
      'category',
      'location',
      'jobType',
      'salary',
      'deadline',

      'companyName',
      'industry',
      'companyWebsite',
      'companyDescription',

      'description',
'responsibilities',
'requirements',
'additionalInformation',

'applicationMethod',
      'applicationEmail',
      'applicationLink',
      'applicationInstructions',

      'contactName',
      'contactEmail',
      'contactPhone',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    if (req.file) {
      const uploadedLogo = await uploadImageToCloudinary(
        req.file,
        'joblyhub/job-company-logos'
      );

      job.companyLogo = uploadedLogo.url;
      job.companyLogoPublicId = uploadedLogo.publicId;
    }

    // If employer edits an approved/rejected job, send it back for review.
    if (!isAdmin) {
      job.status = 'pending';
      job.rejectionReason = '';
    }
const riskCheck = detectJobRisk(job);

job.riskFlags = riskCheck.riskFlags;
job.riskScore = riskCheck.riskScore;
job.requiresManualReview = riskCheck.requiresManualReview;
    const updatedJob = await job.save();

    res.json({
      message: 'Job updated successfully',
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update job',
      error: error.message,
    });
  }
};

// @desc    Employer/Admin deletes job
// @route   DELETE /api/jobs/:id
// @access  Employer/Admin
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    const isOwner = job.employer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'You are not allowed to delete this job',
      });
    }

    await job.deleteOne();

    res.json({
      message: 'Job deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete job',
      error: error.message,
    });
  }
};

// @desc    Employer/Admin views one job for editing
// @route   GET /api/jobs/employer/:id
// @access  Employer/Admin
const getEmployerJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    const isOwner = job.employer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'You are not allowed to view this job',
      });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch job for editing',
      error: error.message,
    });
  }
};

// @desc    Admin updates job status
// @route   PATCH /api/jobs/admin/:id/status
// @access  Admin
const updateJobStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid job status',
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    job.status = status;

    if (status === 'approved') {
      job.rejectionReason = '';
      job.isActive = true;
    }

    if (status === 'rejected') {
      job.rejectionReason = rejectionReason || 'No reason provided';
    }

    if (status === 'pending') {
      job.rejectionReason = '';
    }

    const updatedJob = await job.save();

    res.json({
      message: `Job ${status} successfully`,
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update job status',
      error: error.message,
    });
  }
};

module.exports = {
  createJob,
  getApprovedJobs,
  getJobById,
  getEmployerJobById,
  getMyJobs,
  getAllJobsForAdmin,
  approveJob,
  rejectJob,
  updateJob,
  deleteJob,
  updateJobStatus,
};