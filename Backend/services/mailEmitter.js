const { EventEmitter } = require('events');

class MailEmitter extends EventEmitter {}

// 0 — вообще не ограничивать
const mailEmitter = new MailEmitter();
mailEmitter.setMaxListeners(0);

module.exports = { mailEmitter };
