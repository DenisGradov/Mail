const db = require('../db');

/**
 * Получаем пользователя по его email
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, emails FROM users WHERE email = ? COLLATE NOCASE`,
      [email],
      (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      }
    );
  });
}

/**
 * Аппендим новое письмо в начало массива users.emails (JSON)
 * @param {number} userId
 * @param {Object} emailObj
 * @returns {Promise<void>}
 */
function updateUserEmails(userId, emailObj) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT emails FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) return reject(err);

        let arr;
        try {
          arr = row.emails ? JSON.parse(row.emails) : [];
        } catch {
          arr = [];
        }
        arr.unshift(emailObj);

        const updated = JSON.stringify(arr);
        db.run(
          `UPDATE users SET emails = ? WHERE id = ?`,
          [updated, userId],
          function (err2) {
            if (err2) return reject(err2);
            resolve();
          }
        );
      }
    );
  });
}

module.exports = { getUserByEmail, updateUserEmails };
