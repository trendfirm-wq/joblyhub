const nodemailer = require('nodemailer');
const dns = require('dns');

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email settings are missing in environment variables');
  }

  console.log('Creating Gmail transporter for:', process.env.EMAIL_USER);

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,

    // Force IPv4 lookup. This fixes Render IPv6 ENETUNREACH issues.
    lookup: (hostname, options, callback) => {
      return dns.lookup(hostname, { family: 4 }, callback);
    },

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
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