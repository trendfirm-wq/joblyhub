const sendEmail = require('./sendEmail');

const sendAdminJobAlert = async (job) => {
  console.log('ADMIN ALERT FUNCTION STARTED');

  const adminEmail = process.env.ADMIN_ALERT_EMAIL;

  if (!adminEmail) {
    console.log('ADMIN_ALERT_EMAIL not set. Skipping admin job alert.');
    return;
  }

  console.log('Sending admin alert to:', adminEmail);

  const jobTitle = job.title || 'New job';
  const companyName = job.companyName || 'Unknown employer';
  const location = job.location || 'Not provided';
  const category = job.category || 'Not provided';
  const jobType = job.jobType || 'Not provided';

  const adminDashboardUrl =
    process.env.ADMIN_DASHBOARD_URL ||
    'https://joblyhub-1.onrender.com/admin/dashboard';

  await sendEmail({
    to: adminEmail,
    subject: `New job pending review: ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; background:#f8f5f2; padding:24px;">
        <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:18px; padding:24px; border:1px solid #eadbd5;">
          <h2 style="margin:0 0 12px; color:#502d55;">New Job Submitted</h2>

          <p style="color:#555; line-height:1.6;">
            A new job has been submitted on JoblyHub and is waiting for admin review.
          </p>

          <div style="background:#f3e7e2; border-radius:14px; padding:16px; margin:18px 0;">
            <p><strong>Title:</strong> ${jobTitle}</p>
            <p><strong>Employer:</strong> ${companyName}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Type:</strong> ${jobType}</p>
            <p><strong>Location:</strong> ${location}</p>
          </div>

          <a href="${adminDashboardUrl}"
            style="display:inline-block; background:#502d55; color:#ffffff; padding:13px 18px; border-radius:12px; text-decoration:none; font-weight:bold;">
            Review in Admin Dashboard
          </a>

          <p style="margin-top:18px; color:#777; font-size:13px;">
            JoblyHub automatic admin alert.
          </p>
        </div>
      </div>
    `,
  });

  console.log('ADMIN ALERT FUNCTION FINISHED');
};

module.exports = sendAdminJobAlert;