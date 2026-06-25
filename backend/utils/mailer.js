const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendJobApprovalEmail = async (job) => {
  await resend.emails.send({
    from: 'JoblyHub <business@joblyhub.com>',
    to: process.env.ADMIN_EMAIL, // your test email or admin email
    subject: `New Job Approved: ${job.title}`,
    html: `
      <h2>Job Approved</h2>
      <p>A job has just been approved and is now live.</p>

      <h3>Job Details</h3>
      <ul>
        <li><strong>Title:</strong> ${job.title}</li>
        <li><strong>Company:</strong> ${job.companyName}</li>
        <li><strong>Category:</strong> ${job.category}</li>
        <li><strong>Location:</strong> ${job.location}</li>
        <li><strong>Job Type:</strong> ${job.jobType}</li>
        <li><strong>Approved At:</strong> ${new Date(job.approvedAt).toLocaleString()}</li>
      </ul>

      <p>
        <a href="https://joblyhub.com/jobs/${job._id}">
          View Job
        </a>
      </p>
    `,
  });
};

module.exports = {
  sendJobApprovalEmail,
};