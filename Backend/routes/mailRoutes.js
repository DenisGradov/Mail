const express = require('express');
const router  = express.Router();

const { getUserByToken } = require('../DataBase/functions/getUserByToken');
const { mailEmitter }    = require('../services/mailEmitter');
const {setEmailFavorite} = require("../DataBase/functions/setEmailFavorite");
const {updateUserEmails, getUserByEmail} = require("../DataBase/functions/updateUserEmails");
const {createTransport,} = require("nodemailer");
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

/**
 * GET /api/mail
 * Пакетная отдача писем из JSON‑поля users.emails
 * → ?limit=Number (max 200), cursor=lastEmail.id
 */



router.get('/', async (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const user = await getUserByToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const limit  = Math.min(parseInt(req.query.limit) || 50, 200);
  const cursor = req.query.cursor;

  let arr = [];
  try { arr = user.emails ? JSON.parse(user.emails) : []; }
  catch { arr = []; }

  arr.sort((a, b) => new Date(b.date) - new Date(a.date));

  let start = 0;
  if (cursor) {
    const idx = arr.findIndex(m => m.id === cursor);
    if (idx !== -1) start = idx + 1;
  }

  const items      = arr.slice(start, start + limit);
  const nextCursor = items.length ? items[items.length - 1].id : null;
  const hasMore    = start + items.length < arr.length;

  res.json({ items, nextCursor, hasMore });
});

/**
 * GET /api/mail/stream
 * SSE‑поток: пушим новые письма по событию mailEmitter
 */
router.get('/stream', async (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).end();

  const user = await getUserByToken(token);
  if (!user) return res.status(401).end();

  res.set({
    'Content-Type' : 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection     : 'keep-alive',
  });
  res.flushHeaders();

  const onNew = (email) => {
    if (email.to === user.email) {
      res.write(`event: email\n`);
      res.write(`data: ${JSON.stringify(email)}\n\n`);
    }
  };

  mailEmitter.on('newEmail', onNew);
  req.on('close', () => mailEmitter.off('newEmail', onNew));
});

router.patch(
  '/:id/favorite',
  async (req, res) => {
    const token = req.cookies?.auth_token;
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
      const user = await getUserByToken(token);
      if (!user) return res.status(401).json({ error: 'Invalid token' });

      const mailId   = req.params.id;
      const favorite = req.body.favorite;

      const updatedMail = await setEmailFavorite(user.id, mailId, favorite);
      if (!updatedMail) {
        return res.status(404).json({ error: 'Mail not found' });
      }
      res.json(updatedMail);
    } catch (err) {
      console.error('favorite error:', err);
      res.status(500).json({ error: 'Internal error' });
    }
  }
);

module.exports = router;
