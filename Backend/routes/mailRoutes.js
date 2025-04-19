const express = require('express');
const router  = express.Router();

const { getUserByToken } = require('../DataBase/functions/getUserByToken');
const { mailEmitter }    = require('../services/mailEmitter');
const {setEmailFavorite} = require("../DataBase/functions/setEmailFavorite");
const {updateUserEmails, getUserByEmail} = require("../DataBase/functions/updateUserEmails");
const {createTransport} = require("nodemailer");



router.post("/send", express.json(), async (req, res) => {
  console.log("📬 [send] Запрос на отправку письма");

  const token = req.cookies?.auth_token;
  if (!token) {
    console.warn("⚠️ [send] Нет токена");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sender = await getUserByToken(token);
  if (!sender) {
    console.warn("⚠️ [send] Неверный токен");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { recipients, subject, text } = req.body;

  // Backend-валидация
  if (!recipients) return res.status(400).json({ error: "Recipient is required" });
  if (recipients.length < 3) return res.status(400).json({ error: "Recipient must be at least 3 characters" });
  if (!subject) return res.status(400).json({ error: "Subject is required" });
  if (subject.length < 3) return res.status(400).json({ error: "Subject must be at least 3 characters" });
  if (!text) return res.status(400).json({ error: "Message text is required" });
  if (text.length < 3) return res.status(400).json({ error: "Message must be at least 3 characters" });

  console.log(`🔍 [send] Проверяем получателя ${recipients}`);
  const recipientUser = await getUserByEmail(recipients);
  if (!recipientUser) {
    console.warn(`❌ [send] Получатель ${recipients} не найден`);
    return res.status(400).json({ error: "Recipient does not exist" });
  }

  try {
    console.log("🚀 [send] Отправляем через SMTP...");
    const transporter = createTransport({
      host: "localhost",
      port: process.env.SMTP_PORT || 2525,
      secure: false,
      tls: { rejectUnauthorized: false },
    });

    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: recipients,
      subject,
      text,
    });

    console.log(`✅ [send] Message sent: ${info.messageId}`);

    // Сохраняем в JSON‑поле и пушим SSE
    const emailObj = {
      id: info.messageId,
      favorite: false,
      viewed: false,
      from: sender.email,
      to: recipients,
      subject,
      date: new Date().toISOString(),
      contentType: "text/plain",
      text,
      html: "",
      attachments: [],
    };
    await updateUserEmails(recipientUser.id, emailObj);
    mailEmitter.emit("newEmail", emailObj);

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ [send] Ошибка отправки:", err);
    res.status(500).json({ error: "Server error. Try again later." });
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
