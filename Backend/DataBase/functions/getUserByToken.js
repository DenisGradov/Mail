// DataBase/functions/getUserByToken.js
const db = require('../db');


async function getUserByToken(token) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, login, email, name, surname, status, emails, sent_emails
       FROM users
       WHERE auth = ?`,
      [token],
      (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve(row);
      }
    );
  });
}

module.exports = { getUserByToken };
