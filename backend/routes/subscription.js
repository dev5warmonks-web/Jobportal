const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (err) {
  nodemailer = null;
}
const nodemailerAvailable = !!nodemailer;

// GET /api/subscriptions?email=foo
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const exists = await Subscription.findOne({ email: email.toLowerCase() });
    return res.json({ exists: !!exists });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/subscriptions
router.post('/', async (req, res) => {
  try {
    const { email, userId } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const normalized = email.toLowerCase();
    const existing = await Subscription.findOne({ email: normalized });
    if (existing) {
      return res.status(200).json({ message: 'Already subscribed', subscribed: true });
    }

    const sub = new Subscription({ email: normalized, user: userId || undefined });
    await sub.save();

    // Track email send result
    let emailSent = false;
    let emailError = null;

    // Send notification email (if nodemailer configured)
    if (nodemailerAvailable) {
      const missing = [];
      if (!process.env.SMTP_HOST) missing.push('SMTP_HOST');
      if (!process.env.SMTP_USER) missing.push('SMTP_USER');
      if (!process.env.SMTP_PASS) missing.push('SMTP_PASS');

      if (missing.length > 0) {
        emailError = `Missing SMTP env vars: ${missing.join(', ')}`;
        console.warn('Nodemailer is installed but SMTP env vars missing:', missing.join(', '));
        console.log('Subscription saved for', normalized, '- skipping email (incomplete SMTP config)');
      } else {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: process.env.NOTIFY_EMAIL || 'lijojohneben@gmail.com',
          subject: 'New newsletter subscription',
          text: `New subscription: ${normalized}`,
        };

        try {
          // verify transporter connection and send mail so errors are visible in logs
          await transporter.verify();
          const info = await transporter.sendMail(mailOptions);
          console.log('Subscription email sent:', info && info.messageId);
          emailSent = true;
        } catch (mailErr) {
          emailError = mailErr && mailErr.message ? mailErr.message : String(mailErr);
          console.error('Mail error sending notification:', mailErr);
        }
      }
    } else {

      // nodemailer not installed - just log
      emailError = 'nodemailer module not available';
      console.warn('nodemailer module not available; skipping notification emaild',nodemailerAvailable);
      console.log('Subscription saved for', normalized, '- skipping email (nodemailer not installed)');
    }

    return res.status(201).json({
      message: 'Subscribed',
      subscribed: true,
      emailSent,
      emailError: emailError || undefined,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(200).json({ message: 'Already subscribed', subscribed: true });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// POST /api/subscriptions/test-email
// Body: { to?: string }
// Use this route to trigger a test email and return any error details for debugging.
router.post('/test-email', async (req, res) => {
  const to = (req.body && req.body.to) || process.env.NOTIFY_EMAIL || 'lijojohneben@gmail.com';
  if (!nodemailerAvailable) {
    return res.status(500).json({ ok: false, error: 'nodemailer not installed' });
  }

  const missing = [];
  if (!process.env.SMTP_HOST) missing.push('SMTP_HOST');
  if (!process.env.SMTP_USER) missing.push('SMTP_USER');
  if (!process.env.SMTP_PASS) missing.push('SMTP_PASS');
  if (missing.length > 0) {
    return res.status(500).json({ ok: false, error: 'Missing SMTP env vars', missing });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    logger: true,
    debug: true,
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: 'Test email from JobPortal',
    text: 'This is a test email to diagnose SMTP configuration.',
  };

  try {
    await transporter.verify();
  } catch (verifyErr) {
    console.error('SMTP verify error:', verifyErr);
    return res.status(500).json({ ok: false, stage: 'verify', error: verifyErr && verifyErr.message, details: verifyErr });
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    return res.json({ ok: true, info });
  } catch (sendErr) {
    console.error('SMTP send error:', sendErr);
    // send useful fields back
    const payload = { ok: false, stage: 'send', error: sendErr && sendErr.message };
    if (sendErr.code) payload.code = sendErr.code;
    if (sendErr.response) payload.response = sendErr.response;
    return res.status(500).json(payload);
  }
});
