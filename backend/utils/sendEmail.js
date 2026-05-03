const { Resend } = require('resend');

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing in environment variables');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: 'JoblyHub Alerts <onboarding@resend.dev>',
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || 'Failed to send email with Resend');
  }

  console.log('Admin alert email sent with Resend:', data?.id);
};

module.exports = sendEmail;