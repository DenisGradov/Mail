const express = require('express');
const router  = express.Router();

const { getUserByToken } = require('../DataBase/functions/getUserByToken');
const { mailEmitter }    = require('../services/mailEmitter');
const {setEmailFavorite} = require("../DataBase/functions/setEmailFavorite");
const {updateUserEmails, getUserByEmail} = require("../DataBase/functions/updateUserEmails");
const {createTransport,} = require("nodemailer");
const directTransport      = require('nodemailer-direct-transport');
const {addUserSentEmail} = require("../DataBase/functions/addUserSentEmail");


router.post("/send", express.json(), async (req, res) => {
  console.log("📬 [send] Получен запрос на отправку письма");

  // --- 0) Аутентификация и получение user ---
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const user = await getUserByToken(token);
  if (!user) return res.status(401).json({ error: "Invalid token" });

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

    const mailFrom = `"${user.name} ${user.surname}" <${user.email}>`;
    const info = await transporter.sendMail({
      from:    mailFrom,
      to:      recipients,
      subject,
      text,
    });

    console.log(`✅ [send] Письмо отправлено (messageId=${info.messageId})`);
    const emailRecord = {
      id:      info.messageId,
      from:    mailFrom,
      to:      recipients,
      subject,
      // обрезаем текст до 500 символов
      text:    text.length > 500 ? text.slice(0, 500) : text,
      date:    new Date().toISOString(),
    };
    await addUserSentEmail(user.id, emailRecord);
    console.log(`💾 [send] Сохранено отправленное письмо для user.id=${user.id}`);

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
  // 1) Авторизация
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const user = await getUserByToken(token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });

  // 2) Парсим JSON‑поля
  let inbox = [];
  let sent  = [];
  try { inbox = user.emails ? JSON.parse(user.emails) : []; }
  catch { inbox = []; }
  try { sent = user.sent_emails ? JSON.parse(user.sent_emails) : []; }
  catch { sent = []; }

  // 3) Сортируем по дате (новейшие первыми) и режем до 50
  inbox = inbox
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 50);

  sent = sent
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 50);

  // 4) Отдаём две границы
  res.json({
    inbox,  // массив входящих писем (up to 50)
    sent    // массив отправленных писем (up to 50)
  });
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
