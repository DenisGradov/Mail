const express = require('express');
const router  = express.Router();
const { createTransport } = require('nodemailer');
const directTransport      = require('nodemailer-direct-transport');

router.post("/send", express.json(), async (req, res) => {
  console.log("📬 [send] Получен запрос на отправку письма");

  const { recipients, subject, text } = req.body;

  // Валидация
  if (!recipients || typeof recipients !== 'string' || recipients.length < 3)
    return res.status(400).json({ error: "Recipient is required and must be ≥3 chars" });
  if (!subject || subject.length < 3)
    return res.status(400).json({ error: "Subject must be at least 3 characters" });
  if (!text || text.length < 3)
    return res.status(400).json({ error: "Message must be at least 3 characters" });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(recipients))
    return res.status(400).json({ error: "Invalid email format" });

  try {
    console.log("🚀 [send] Конфигурируем direct‑транспорт…");

    // Оборачиваем direct‑transport в Nodemailer
    const transporter = createTransport(
      directTransport({
        name: 'stenford.monster',  // EHLO‑имя вашего домена
        logger: true,
        debug: true,
      })
    );

    // НЕ вызываем transporter.verify() — в direct‑режиме оно пытается пинговать localhost:587 и падает.

    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@stenford.monster>',
      to: recipients,
      subject,
      text,
    });

    console.log(`✅ [send] Письмо отправлено (messageId=${info.messageId})`);
    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ [send] Ошибка отправки через direct SMTP:", err);
    return res.status(500).json({ error: "Server error. Try again later." });
  }
});

module.exports = router;
