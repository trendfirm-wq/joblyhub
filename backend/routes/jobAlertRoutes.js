const express = require('express');
const JobAlert = require('../models/JobAlert');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my', protect, async (req, res) => {
  try {
    const alerts = await JobAlert.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch job alerts',
      error: error.message,
    });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { keyword, category, location, jobType } = req.body;

    if (!keyword && !category && !location && !jobType) {
      return res.status(400).json({
        message: 'Please provide at least one alert preference.',
      });
    }

    const alert = await JobAlert.create({
      user: req.user._id,
      keyword: keyword || '',
      category: category || '',
      location: location || '',
      jobType: jobType || '',
      isActive: true,
    });

    res.status(201).json({
      message: 'Job alert created successfully',
      alert,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create job alert',
      error: error.message,
    });
  }
});

router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const alert = await JobAlert.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!alert) {
      return res.status(404).json({
        message: 'Job alert not found',
      });
    }

    alert.isActive = !alert.isActive;
    await alert.save();

    res.json({
      message: 'Job alert updated',
      alert,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update job alert',
      error: error.message,
    });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const alert = await JobAlert.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!alert) {
      return res.status(404).json({
        message: 'Job alert not found',
      });
    }

    await alert.deleteOne();

    res.json({
      message: 'Job alert deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete job alert',
      error: error.message,
    });
  }
});

module.exports = router;