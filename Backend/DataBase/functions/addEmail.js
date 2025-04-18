const db = require('../db');

async function addEmail({
                          from, to, subject, date,
                          messageId, inReplyTo, references,
                          contentType, textContent, htmlContent
                        }) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO emails
        (from_address, to_address, subject, date,
         message_id, in_reply_to, references,
         content_type, text_content, html_content)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [
      from, to, subject, date,
      messageId, inReplyTo, references,
      contentType, textContent, htmlContent
    ], function(err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

module.exports = { addEmail };
