const db = require('../db');

async function addUserSentEmail(userId, emailObj) {
  return new Promise((resolve, reject) => {
    // 1) достаём текущий JSON из sent_emails
    db.get(
      `SELECT sent_emails FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) return reject(err);

        let list;
        try {
          list = row && row.sent_emails ? JSON.parse(row.sent_emails) : [];
        } catch {
          list = [];
        }

        // 2) добавляем новое письмо вперед
        list.unshift(emailObj);

        // 3) сохраняем обратно
        const json = JSON.stringify(list);
        db.run(
          `UPDATE users SET sent_emails = ? WHERE id = ?`,
          [json, userId],
          (err2) => {
            if (err2) return reject(err2);
            resolve(list);
          }
        );
      }
    );
  });
}

module.exports = { addUserSentEmail };
