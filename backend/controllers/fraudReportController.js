const FraudReport = require('../models/FraudReport');

const createFraudReport = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      jobTitle,
      companyName,
      scammerName,
      scammerPhone,
      scammerEmail,
      message,
    } = req.body;

    if (!message) {
      return res.status(400).json({
        message: 'Please describe the fraud incident.',
      });
    }

    const report = await FraudReport.create({
      fullName: fullName || '',
      email: email || '',
      phone: phone || '',
      jobTitle: jobTitle || '',
      companyName: companyName || '',
      scammerName: scammerName || '',
      scammerPhone: scammerPhone || '',
      scammerEmail: scammerEmail || '',
      message,
    });

    res.status(201).json({
      message: 'Fraud report submitted successfully.',
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to submit fraud report.',
      error: error.message,
    });
  }
};

const getFraudReportsForAdmin = async (req, res) => {
  try {
    const reports = await FraudReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch fraud reports.',
      error: error.message,
    });
  }
};

module.exports = {
  createFraudReport,
  getFraudReportsForAdmin,
};