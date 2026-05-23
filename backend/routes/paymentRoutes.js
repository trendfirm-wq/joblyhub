const express = require('express');
const axios = require('axios');

const User = require('../models/User');
 
const { protect } = require('../middleware/authMiddleware');
const Job = require('../models/Job');

const router = express.Router();

const JOB_POST_FEE = 55;

 


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

  const { jobId } = req.body;

if (!jobId) {
  return res.status(400).json({
    message: 'Job ID is required',
  });
}

const job = await Job.findById(jobId);

if (!job) {
  return res.status(404).json({
    message: 'Job not found',
  });
}

if (job.employer.toString() !== req.user._id.toString()) {
  return res.status(403).json({
    message: 'Not authorized for this job',
  });
}

const reference = `JOBLYHUB_JOB_${job._id}_${Date.now()}`;
    const authHeader = Buffer.from(
      `${process.env.HUBTEL_CLIENT_ID}:${process.env.HUBTEL_CLIENT_SECRET}`
    ).toString('base64');

  job.paymentReference = reference;
job.paymentStatus = 'pending';

await job.save();

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
     job.paymentStatus = 'failed';
await job.save();

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

   const job = await Job.findOne({
  paymentReference: reference,
});

  if (!job) {
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
    job.paymentStatus = 'failed';
await job.save();

      return res.status(200).json({
        message: 'Payment not successful',
      });
    }

    job.paymentStatus = 'paid';
job.status = 'pending_review';
job.paidAt = new Date();
job.submittedForReviewAt = new Date();

await job.save();


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

    const job = await Job.findOne({
      employer: req.user._id,
      paymentReference: reference,
    });

    if (!job) {
      return res.status(404).json({
        message: 'Payment record not found',
      });
    }

    return res.json({
      success: true,
      paymentReference: job.paymentReference,
      paymentStatus: job.paymentStatus,
      jobStatus: job.status,
      amount: job.paymentAmount,
      jobId: job._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to check payment status',
      error: error.message,
    });
  }
});
 
 
module.exports = router;