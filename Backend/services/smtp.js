const { SMTPServer }   = require('smtp-server');
const { simpleParser } = require('mailparser');
const { getUserByEmail, updateUserEmails } = require('../DataBase/functions/updateUserEmails');
const fs   = require('fs');
const path = require('path');

const server = new SMTPServer({
  authOptional: true,
  secure: false,

  onData(stream, session, callback) {
    simpleParser(stream)
      .then(async parsed => {
        try {
          // 1) Найдём пользователя по адресу назначения
          const toAddrRaw = parsed.to?.value?.[0]?.address || '';
          const toAddr    = toAddrRaw.trim().toLowerCase();
          const user = await getUserByEmail(toAddr);
          if (!user) {
            console.warn(`⚠️ Юзер с email=${toAddr} не найден, пропускаем.`);
            return callback();
          }

          // 2) Собираем объект письма
          const emailObj = {
            id:           parsed.messageId,
            favorite:     false,
            viewed:       false,
            from:         parsed.from?.value?.[0]?.address || '',
            to:           toAddr,
            subject:      parsed.subject || '',
            date:         parsed.date?.toISOString() || new Date().toISOString(),
            contentType:  parsed.html ? 'text/html' : 'text/plain',
            content:      parsed.html || parsed.text || '',
            attachments:  []
          };

          // 3) Сохраняем вложения на диск и пушим метаданные в JSON
          if (parsed.attachments?.length) {
            const uploadDir = path.join(__dirname, '..', 'uploads', `mail_${Date.now()}`);
            fs.mkdirSync(uploadDir, { recursive: true });

            for (const att of parsed.attachments) {
              const fn       = att.filename || `attach_${Date.now()}`;
              const fp       = path.join(uploadDir, fn);
              fs.writeFileSync(fp, att.content);  // умеренно памяти, дальше дропаем буфер
              emailObj.attachments.push({
                filename:    fn,
                contentType: att.contentType,
                size:        att.size,
                path:        fp
              });
            }
          }

          // 4) Обновляем users.emails
          await updateUserEmails(user.id, emailObj);
          console.log(`✅ Письмо ${emailObj.id} добавлено в JSON-поле пользователя ${user.id}`);
        } catch (err) {
          console.error('❌ Ошибка при сохранении письма в JSON:', err);
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
  }
});

server.listen(25, '0.0.0.0', () => {
  console.log('🚀 SMTP Print‑сервер запущен на порту 25. Жду писем :)');
});
