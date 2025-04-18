const { EventEmitter } = require('events');
class MailEmitter extends EventEmitter {}
const mailEmitter = new MailEmitter();
module.exports = { mailEmitter };