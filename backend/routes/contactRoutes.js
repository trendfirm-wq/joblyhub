const express = require('express');
const { Resend } = require('resend');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: 'Name, email, and message are required',
      });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        message: 'Email service is not configured',
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const fromEmail =
      process.env.RESEND_FROM_EMAIL || 'JoblyHub <onboarding@resend.dev>';

    const toEmail = process.env.CONTACT_RECEIVER_EMAIL || 'info@joblyhub.com';

    const finalSubject = subject
      ? `JoblyHub Contact: ${subject}`
      : 'New JoblyHub Contact Message';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: finalSubject,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:30px;">
          <div style="max-width:620px; margin:0 auto; background:#ffffff; border-radius:16px; padding:26px; border:1px solid #e2e8f0;">
            <h2 style="margin:0 0 16px; color:#0f172a;">New Contact Message</h2>

            <p style="margin:0 0 10px; color:#334155;">
              <strong>Name:</strong> ${name}
            </p>

            <p style="margin:0 0 10px; color:#334155;">
              <strong>Email:</strong> ${email}
            </p>

            <p style="margin:0 0 10px; color:#334155;">
              <strong>Subject:</strong> ${subject || 'No subject'}
            </p>

            <div style="margin-top:22px; padding:18px; background:#f1f5f9; border-radius:12px; color:#0f172a; line-height:1.7;">
              ${message.replace(/\n/g, '<br />')}
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend contact error:', error);

      return res.status(500).json({
        message: error.message || 'Failed to send message',
      });
    }

    console.log('CONTACT MESSAGE SENT:', data);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Contact form error:', error);

    return res.status(500).json({
      message: 'Server error while sending contact message',
    });
  }
});

module.exports = router;