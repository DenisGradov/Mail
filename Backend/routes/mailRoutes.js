const express = require('express');
const router = express.Router();

// Пример почтового запроса (заглушка)
router.post('/send', (req, res) => {
  const { to, subject, message } = req.body;
  console.log(`📩 Письмо для ${to}: ${subject} — ${message}`);
  res.json({ success: true });
});

module.exports = router;
