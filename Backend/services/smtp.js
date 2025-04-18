const { SMTPServer }   = require('smtp-server');
const { simpleParser } = require('mailparser');
const fs               = require('fs');
const path             = require('path');

const { getUserByEmail, updateUserEmails } = require('../DataBase/functions/updateUserEmails');
const { mailEmitter }                     = require('./mailEmitter');

const server = new SMTPServer({
  authOptional: true,
  secure: false,

  onData(stream, session, callback) {
    simpleParser(stream)
      .then(async parsed => {
        try {
          // 1) нормализуем адрес, ищем юзера
          const toRaw  = parsed.to?.value?.[0]?.address || '';
          const toAddr = toRaw.trim().toLowerCase();
          const user   = await getUserByEmail(toAddr);
          if (!user) {
            console.warn(`⚠️ Юзер ${toAddr} не найден — пропускаем письмо.`);
            return callback();
          }

          // 2) собираем объект письма
          const emailObj = {
            id:          parsed.messageId,
            favorite:    false,
            viewed:      false,
            from:        parsed.from?.value?.[0]?.address || '',
            to:          toAddr,
            subject:     parsed.subject || '',
            date:        parsed.date?.toISOString() || new Date().toISOString(),
            contentType: parsed.html ? 'text/html' : 'text/plain',
            text: parsed.text || '',
            html: parsed.html || '',
            attachments: []
          };

          // 3) сохраняем вложения на диск + метаданные
          if (parsed.attachments?.length) {
            const uploadDir = path.join(__dirname, '..', 'uploads', `mail_${Date.now()}`);
            fs.mkdirSync(uploadDir, { recursive: true });
            for (const att of parsed.attachments) {
              const fn = att.filename || `attach_${Date.now()}`;
              const fp = path.join(uploadDir, fn);
              fs.writeFileSync(fp, att.content);
              emailObj.attachments.push({
                filename:    fn,
                contentType: att.contentType,
                size:        att.size,
                path:        fp
              });
            }
          }

          // 4) пушим в JSON‑поле и эмитим событие
          await updateUserEmails(user.id, emailObj);
          mailEmitter.emit('newEmail', emailObj);
          console.log(`✅ Письмо ${emailObj.id} сохранено и эмитировано.`);
        } catch (err) {
          console.error('❌ Ошибка обработки письма:', err);
        }
        callback();
      })
      .catch(err => {
        console.error('❌ SMTP‑парсинг упал:', err);
        callback(err);
      });
  },

  onError(err) {
    console.error('❌ SMTP Server error:', err);
  },
});

const PORT = process.env.SMTP_PORT || 25;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SMTP Print‑сервер запущен на порту ${PORT}.`);
});
