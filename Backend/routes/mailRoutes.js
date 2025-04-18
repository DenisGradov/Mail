const express = require('express');
const router = express.Router();

const { sendEmail } = require('../services/emailService');
const { addEmail } = require('../DataBase/functions/addEmail');

// POST /api/mail/send
router.post('/send', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    if (!to || !subject || (!text && !html))
      return res.status(400).json({ success: false, message: 'Missing fields' });

    const info = await sendEmail({ to, subject, text, html });
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('❌ send error:', err);
    res.status(500).json({ success: false, message: 'Email send failed' });
  }
});

// POST /api/mail/receive   <-- веб‑хук входящих писем
router.post('/receive', async (req, res) => {
  try {
    const { from, to, subject, text } = req.body;
    if (!from || !to)
      return res.status(400).json({ success: false, message: 'Missing fields' });

    await addEmail({ sender: from, recipient: to, subject, body: text });
    console.log(`📥 ${from} ➡ ${to}: ${subject}`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ receive error:', err);
    res.status(500).json({ success: false, message: 'Inbound processing failed' });
  }
});

module.exports = router;
