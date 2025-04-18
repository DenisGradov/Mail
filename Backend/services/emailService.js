const { addEmail }      = require('../DataBase/functions/addEmail');
const { addAttachment } = require('../DataBase/functions/addAttachment');
const fs = require('fs');
const path = require('path');

async function saveParsedEmail(parsed) {
  // Собираем поля письма
  const from         = parsed.from?.value?.[0]?.address || '';
  const to           = (parsed.to?.value?.map(v => v.address).join(', ')) || '';
  const subject      = parsed.subject || '';
  const date         = parsed.date ? parsed.date.toISOString() : new Date().toISOString();
  const messageId    = parsed.messageId;
  const inReplyTo    = parsed.inReplyTo || '';
  const references   = Array.isArray(parsed.references) ? parsed.references.join(', ') : '';
  const contentType  = parsed.html ? 'text/html' : parsed.text ? 'text/plain' : '';
  const textContent  = parsed.text || '';
  const htmlContent  = parsed.html || '';

  // Сохраняем письмо в БД
  const emailId = await addEmail({
    from, to, subject, date,
    messageId, inReplyTo, references,
    contentType, textContent, htmlContent
  });

  // Если есть вложения — сохраняем их на диск и в БД
  if (parsed.attachments && parsed.attachments.length) {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads', `email_${emailId}`);
    fs.mkdirSync(uploadDir, { recursive: true });

    for (let att of parsed.attachments) {
      const filename = att.filename;
      const filepath = path.join(uploadDir, filename);

      // Записываем Buffer в файл (умеренно память жрёт — но дальше мы его отбрасываем)
      fs.writeFileSync(filepath, att.content);

      await addAttachment({
        emailId,
        filename,
        contentType: att.contentType,
        size:        att.size,
        path:        filepath
      });
    }
  }

  return emailId;
}

module.exports = { saveParsedEmail };
