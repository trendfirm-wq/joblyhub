const express = require('express');
const axios = require('axios');

const User = require('../models/User');
const JobPostCode = require('../models/JobPostCode');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const JOB_POST_FEE = 55;

const generateJobCode = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `JOBLY-${random}`;
};

const generateUniqueJobCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = generateJobCode();
    exists = await JobPostCode.findOne({ code });
  }

  return code;
};

router.post('/hubtel/job-post/pay', protect, async (req, res) => {
  try {
    if (req.user.role !== 'employer' && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Only employers can pay to post jobs',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const reference = `JOBLYHUB_JOB_${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}`;

    const authHeader = Buffer.from(
      `${process.env.HUBTEL_CLIENT_ID}:${process.env.HUBTEL_CLIENT_SECRET}`
    ).toString('base64');

    await JobPostCode.create({
      employer: user._id,
      amount: JOB_POST_FEE,
      paymentReference: reference,
      paymentStatus: 'pending',
      code: reference,
      isUsed: false,
    });

    const payload = {
      totalAmount: JOB_POST_FEE,
      description: 'JoblyHub job posting fee',
      callbackUrl: process.env.HUBTEL_CALLBACK_URL,
      returnUrl: process.env.HUBTEL_RETURN_URL,
      cancellationUrl:
        process.env.HUBTEL_CANCEL_URL || process.env.HUBTEL_RETURN_URL,
      merchantAccountNumber:
        process.env.HUBTEL_MERCHANT_ID ||
        process.env.HUBTEL_MERCHANT_ACCOUNT_NUMBER,
      clientReference: reference,
    };

    const response = await axios.post(
      'https://payproxyapi.hubtel.com/items/initiate',
      payload,
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const checkoutUrl = response.data?.data?.checkoutUrl;

    if (!checkoutUrl) {
      await JobPostCode.findOneAndUpdate(
        { paymentReference: reference },
        { paymentStatus: 'failed' }
      );

      return res.status(500).json({
        message: 'No checkout URL returned from Hubtel',
      });
    }

    return res.json({
      success: true,
      checkoutUrl,
      reference,
      amount: JOB_POST_FEE,
    });
  } catch (error) {
    console.log('JOB POST PAYMENT ERROR:', error.response?.data || error.message);

    return res.status(500).json({
      message: 'Failed to start job post payment',
      error: error.response?.data || error.message,
    });
  }
});

router.post('/hubtel/job-post/callback', async (req, res) => {
  try {
    console.log(
      'JOBLYHUB JOB POST CALLBACK:',
      JSON.stringify(req.body, null, 2)
    );

    const reference =
      req.body.clientReference ||
      req.body.ClientReference ||
      req.body.Data?.ClientReference ||
      req.body.data?.clientReference ||
      req.body.Response?.ClientReference;

    const status =
      req.body.status ||
      req.body.Status ||
      req.body.ResponseCode ||
      req.body.Data?.Status ||
      req.body.data?.status ||
      req.body.Response?.Status;

    if (!reference) {
      return res.status(400).json({
        message: 'No payment reference found',
      });
    }

    const paymentRecord = await JobPostCode.findOne({
      paymentReference: reference,
    });

    if (!paymentRecord) {
      return res.status(404).json({
        message: 'Payment record not found',
      });
    }

    const paid =
      String(status).toLowerCase() === 'success' ||
      String(status).toLowerCase() === 'successful' ||
      String(status).toLowerCase() === 'paid' ||
      String(status) === '0000';

    if (!paid) {
      paymentRecord.paymentStatus = 'failed';
      await paymentRecord.save();

      return res.status(200).json({
        message: 'Payment not successful',
      });
    }

    paymentRecord.paymentStatus = 'completed';
    await paymentRecord.save();

const user = await User.findById(paymentRecord.employer);

if (
  user &&
  user.role === 'employer' &&
  !user.hasReceivedFirstJobPostBonusCode
) {
  const newCode = await generateUniqueJobCode();

  await JobPostCode.create({
    code: newCode,
    employer: user._id,
    amount: 0,
    paymentReference: `BONUS_${Date.now()}_${user._id}`,
    paymentStatus: 'completed',
    isUsed: false,
  });

  user.hasReceivedFirstJobPostBonusCode = true;
  await user.save();

  console.log('FIRST PAYMENT BONUS CODE CREATED:', newCode);
}
    return res.status(200).json({
      message: 'Payment successful. Job post unlocked.',
    });
  } catch (error) {
    console.error('JOB POST CALLBACK ERROR:', error);

    return res.status(500).json({
      message: 'Server error in job post callback',
    });
  }
});

router.get('/job-post/status/:reference', protect, async (req, res) => {
  try {
    const { reference } = req.params;

    const paymentRecord = await JobPostCode.findOne({
      employer: req.user._id,
      paymentReference: reference,
    });

    if (!paymentRecord) {
      return res.status(404).json({
        message: 'Payment record not found',
      });
    }

    return res.json({
      success: true,
      paymentReference: paymentRecord.paymentReference,
      paymentStatus: paymentRecord.paymentStatus,
      isUsed: paymentRecord.isUsed,
      amount: paymentRecord.amount,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to check payment status',
      error: error.message,
    });
  }
});

router.get('/job-post/available-unlock', protect, async (req, res) => {
  try {
    const availablePaidUnlock = await JobPostCode.findOne({
      employer: req.user._id,
      paymentStatus: 'completed',
      isUsed: false,
      amount: JOB_POST_FEE,
    }).sort({ createdAt: -1 });

    const availableFreeCode = await JobPostCode.findOne({
      employer: req.user._id,
      paymentStatus: 'completed',
      isUsed: false,
      amount: 0,
    }).sort({ createdAt: -1 });

    res.json({
      hasAvailablePaidUnlock: !!availablePaidUnlock,
      hasAvailableFreeCode: !!availableFreeCode,

      paidUnlockReference:
        availablePaidUnlock?.paymentReference || null,

      freeCode:
        availableFreeCode?.code || null,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to check available unlocks',
      error: error.message,
    });
  }
});

router.get('/job-post/my-codes', protect, async (req, res) => {
  try {
    const codes = await JobPostCode.find({
      employer: req.user._id,
      amount: 0,
    })
      .populate('usedForJob', 'title status createdAt')
      .sort({ createdAt: -1 });

    res.json(codes);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch job post codes',
      error: error.message,
    });
  }
});

module.exports = router;