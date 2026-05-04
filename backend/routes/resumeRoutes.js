const express = require('express');
const multer = require('multer');
const Resume = require('../models/Resume');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadPdfToCloudinary = async (file) => {
  const base64Pdf = `data:${file.mimetype};base64,${file.buffer.toString(
    'base64'
  )}`;

  const result = await cloudinary.uploader.upload(base64Pdf, {
    folder: 'joblyhub/resumes',
    resource_type: 'raw',
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

router.get('/my', protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(resumes);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch resumes',
      error: error.message,
    });
  }
});

router.post('/', protect, upload.single('resume'), async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: 'Please upload a PDF resume.',
      });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        message: 'Only PDF files are allowed.',
      });
    }

    const uploaded = await uploadPdfToCloudinary(req.file);

    const existingCount = await Resume.countDocuments({ user: req.user._id });

    const resume = await Resume.create({
      user: req.user._id,
      title: title || req.file.originalname || 'My Resume',
      fileUrl: uploaded.url,
      filePublicId: uploaded.publicId,
      originalName: req.file.originalname,
      isDefault: existingCount === 0,
    });

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to upload resume',
      error: error.message,
    });
  }
});

router.patch('/:id/default', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        message: 'Resume not found',
      });
    }

    await Resume.updateMany(
      { user: req.user._id },
      { $set: { isDefault: false } }
    );

    resume.isDefault = true;
    await resume.save();

    res.json({
      message: 'Default resume updated',
      resume,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update default resume',
      error: error.message,
    });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        message: 'Resume not found',
      });
    }

    if (resume.filePublicId) {
      await cloudinary.uploader.destroy(resume.filePublicId, {
        resource_type: 'raw',
      });
    }

    await resume.deleteOne();

    res.json({
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete resume',
      error: error.message,
    });
  }
});

module.exports = router;