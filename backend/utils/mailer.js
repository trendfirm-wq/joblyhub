const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendJobApprovalEmail = async (job) => {
  const mailOptions = {
    from: `"JoblyHub System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
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
  };

console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('Sending approval email...');
console.log('MAIL OPTIONS:', mailOptions);
const info = await transporter.sendMail(mailOptions);

console.log('EMAIL SENT SUCCESSFULLY');
console.log(info.response);
};

module.exports = {
  sendJobApprovalEmail,
};