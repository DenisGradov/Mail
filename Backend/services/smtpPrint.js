// Backend/services/smtpPrint.js
const { SMTPServer } = require('smtp-server');
const { simpleParser } = require('mailparser');

const server = new SMTPServer({
  // Без авторизации, всё принимаем
  authOptional: true,

  // Здесь прилетает поток письма
  onData(stream, session, callback) {
    simpleParser(stream)
      .then(parsed => {
        console.log('📥 Новое письмо:');
        console.log('  From:   ', parsed.from?.text);
        console.log('  To:     ', parsed.to?.text);
        console.log('  Subject:', parsed.subject);
        console.log('  Text:   ', parsed.text);
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

// Запускаем на 0.0.0.0:25 — не трогай, если уже что-то занят порт
server.listen(25, '0.0.0.0', () => {
  console.log('🚀 SMTP Print‑сервер запущен на порту 25. Готов к приёму писем!');
});
