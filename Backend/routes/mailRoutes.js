const express = require('express');
const router  = express.Router();

const { getUserByToken } = require('../DataBase/functions/getUserByToken');
const { mailEmitter }    = require('../services/mailEmitter');

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

module.exports = router;
