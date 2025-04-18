// Backend/services/smtpPrint.js
const { SMTPServer } = require('smtp-server');
const { simpleParser } = require('mailparser');

const server = new SMTPServer({
  // Без авторизации, всё принимаем
  authOptional: true,
  secure: false,
  // Здесь прилетает поток письма
  onData(stream, session, callback) {
    simpleParser(stream)
      .then(parsed => {
        console.log('📥 ПОЛНЫЙ РАЗБОР ПИСЬМА:');
        console.dir(parsed, { depth: null });

        console.log('  HTML:   ', parsed.html ? '[HTML есть]' : '[HTML пусто]');
        console.log('─'.repeat(40));
        callback(); // отвечаем SMTP-клиенту “250 OK”
      })
      .catch(err => {
        console.error('❌ Ошибка парсинга:', err);
        callback(err);
      });
  },

  // Ловим нижние ошибки
  onError(err) {
    console.error('❌ SMTP Server error:', err);
  },
});

const PORT = 25
server.listen(25, '0.0.0.0', () => {
  console.log('🚀 SMTP Print‑сервер запущен на порту 2525. Готов к приёму писем!');
});
