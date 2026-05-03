const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email settings are missing in environment variables');
  }

  console.log('Creating Gmail transporter for:', process.env.EMAIL_USER);

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  console.log('SEND EMAIL STARTED:', { to, subject });

  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: `"JoblyHub Alerts" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log('ADMIN ALERT EMAIL SENT:', info.messageId);
};

module.exports = sendEmail;