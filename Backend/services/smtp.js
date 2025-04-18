const { SMTPServer }   = require('smtp-server');
const { simpleParser } = require('mailparser');
const { saveParsedEmail } = require('../services/emailService');

const server = new SMTPServer({
  authOptional: true,
  secure: false,

  onData(stream, session, callback) {
    simpleParser(stream)
      .then(async parsed => {
        console.log(`📥 Получено письмо от ${parsed.from.text}, сохраняем…`);
        try {
          const id = await saveParsedEmail(parsed);
          console.log(`✅ Письмо записано в БД с id=${id}`);
        } catch (err) {
          console.error('❌ Ошибка сохранения письма:', err);
        }
        callback();
      })
      .catch(err => {
        console.error('❌ Ошибка парсинга письма:', err);
        callback(err);
      });
  },

  onError(err) {
    console.error('❌ SMTP Server error:', err);
  },
});

server.listen(25, '0.0.0.0', () => {
  console.log('🚀 SMTP Print‑сервер запущен. Жду писем :)');
});
