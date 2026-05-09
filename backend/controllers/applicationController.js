const Application = require('../models/Application');
const Job = require('../models/Job');
const cloudinary = require('../config/cloudinary');
const ActivityLog = require('../models/ActivityLog');

const APPLICANT_PUBLIC_FIELDS =
  'name location preferredJobCategory highestQualification experienceLevel emailVerified phoneVerified';

const JOB_PUBLIC_FIELDS =
  'title companyName location jobType category salary status applicationMethod applicationEmail applicationLink';

const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    ''
  );
};

const logSecurityEvent = async (label, req, extra = {}) => {
  const payload = {
    userId: req.user?._id,
    email: req.user?.email,
    role: req.user?.role,
    ip: getClientIp(req),
    userAgent: req.headers['user-agent'] || '',
    route: req.originalUrl,
    time: new Date().toISOString(),
    ...extra,
  };

  console.log(label, payload);

  try {
    await ActivityLog.create({
      user: req.user?._id,
      email: req.user?.email || '',
      role: req.user?.role || '',
      action: label.replace(':', ''),
      route: req.originalUrl,
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'] || '',
      metadata: extra,
    });
  } catch (error) {
    console.error('ACTIVITY LOG SAVE ERROR:', error.message);
  }
};

const uploadPdfToCloudinary = async (file) => {
  if (!file) return { url: '', publicId: '' };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'joblyhub/applications',
        resource_type: 'raw',
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(file.buffer);
  });
};

const applyForJob = async (req, res) => {
  try {
    await logSecurityEvent('APPLICATION SUBMIT STARTED:', req, {
      jobId: req.params.jobId,
    });

    const { fullName, email, phone, coverLetter, resumeLink } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: 'Full name and email are required' });
    }

    const job = await Job.findById(req.params.jobId);

    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.status !== 'approved' || !job.isActive) {
      return res.status(400).json({
        message: 'You can only apply to approved active jobs',
      });
    }

    if (job.applicationMethod !== 'joblyhub') {
      return res.status(400).json({
        message: 'This job is not accepting applications through JoblyHub',
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

    let applicationPdfUrl = '';
    let applicationPdfPublicId = '';

    if (req.file) {
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ message: 'Please upload one PDF document only' });
      }

      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'PDF must be less than 5MB' });
      }

      const uploadedPdf = await uploadPdfToCloudinary(req.file);
      applicationPdfUrl = uploadedPdf.url;
      applicationPdfPublicId = uploadedPdf.publicId;
    }

    if (!applicationPdfUrl && !resumeLink) {
      return res.status(400).json({
        message: 'Please upload your cover letter and CV/resume as one PDF document',
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
      applicationPdfUrl,
      applicationPdfPublicId,
      status: 'submitted',
    });

    await logSecurityEvent('APPLICATION SUBMITTED SUCCESSFULLY:', req, {
      applicationId: application._id,
      jobId: job._id,
      jobTitle: job.title,
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    console.error('APPLICATION SUBMIT ERROR:', error);

    res.status(500).json({
      message: 'Failed to submit application',
      error: error.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    await logSecurityEvent('JOB SEEKER VIEWED OWN APPLICATIONS:', req);

    const applications = await Application.find({ applicant: req.user._id })
      .sort({ createdAt: -1 })
      .populate('job', JOB_PUBLIC_FIELDS);

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch your applications',
      error: error.message,
    });
  }
};

const getEmployerApplications = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== 'admin') {
      const employerJobs = await Job.find({ employer: req.user._id }).select('_id title');
      const jobIds = employerJobs.map((job) => job._id);

      filter = { job: { $in: jobIds } };
    }

  const applications = await Application.find(filter)
  .sort({ createdAt: -1 })
  .populate('job', 'title companyName location jobType category')
  .populate('applicant', APPLICANT_PUBLIC_FIELDS);

const contactAllowedStatuses = [
  'shortlisted',
  'contacted',
  'interviewing',
  'hired',
];

const protectedApplications = applications.map((application) => {
  const app = application.toObject();

  const canViewContact =
    req.user.role === 'admin' ||
    contactAllowedStatuses.includes(app.status);

  if (!canViewContact) {
    app.email = '';
    app.phone = '';
  }

  return app;
});

await logSecurityEvent('EMPLOYER VIEWED APPLICATIONS:', req, {
  applicationsCount: protectedApplications.length,
});

res.json(protectedApplications);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch employer applications',
      error: error.message,
    });
  }
};

const getAllApplicationsForAdmin = async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .populate('job', 'title companyName location jobType category')
      .populate('applicant', APPLICANT_PUBLIC_FIELDS);

    await logSecurityEvent('ADMIN VIEWED ALL APPLICATIONS:', req, {
      applicationsCount: applications.length,
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch all applications',
      error: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const {
      status,
      employerNote,
      interviewDate,
      interviewMethod,
      interviewLocation,
    } = req.body;

    const allowedStatuses = [
      'submitted',
      'reviewed',
      'shortlisted',
      'contacted',
      'interviewing',
      'hired',
      'not_selected',
      'rejected',
    ];

    const allowedInterviewMethods = ['', 'phone', 'whatsapp', 'in_person', 'online'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid application status' });
    }

    if (interviewMethod !== undefined && !allowedInterviewMethods.includes(interviewMethod)) {
      return res.status(400).json({ message: 'Invalid interview method' });
    }

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isJobOwner = application.job.employer.toString() === req.user._id.toString();

    if (!isAdmin && !isJobOwner) {
      await logSecurityEvent('UNAUTHORIZED APPLICATION STATUS UPDATE ATTEMPT:', req, {
        applicationId: req.params.id,
      });

      return res.status(403).json({
        message: 'You are not allowed to update this application',
      });
    }

    application.status = status;

    if (employerNote !== undefined) application.employerNote = employerNote;
    if (interviewDate !== undefined) application.interviewDate = interviewDate || undefined;
    if (interviewMethod !== undefined) application.interviewMethod = interviewMethod;
    if (interviewLocation !== undefined) application.interviewLocation = interviewLocation;

    const updatedApplication = await application.save();

    await logSecurityEvent('APPLICATION STATUS UPDATED:', req, {
      applicationId: updatedApplication._id,
      jobId: application.job._id,
      jobTitle: application.job.title,
      newStatus: status,
    });

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