// DataBase/functions/getUserByToken.js
const db = require('../db');

/**
 * Получение пользователя (включая JSON‑поле emails) по токену
 * @param {string} token
 * @returns {Promise<{ id: number, login: string, email: string, name: string, surname: string, status: number, emails: string } | null>}
 */
async function getUserByToken(token) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, login, email, name, surname, status, emails
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
