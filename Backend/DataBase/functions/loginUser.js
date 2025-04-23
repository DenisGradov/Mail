const db = require('../db');
const { hashPassword } = require('../../Utils/hashPassword');
const { generateToken } = require('../../Utils/main');

async function loginUser(login, password) {
  const hashedPassword = hashPassword(password);

  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, login, email, name, surname, avatar, status, two_factor_secret, two_factor_enabled FROM users WHERE login = ? AND password = ?`,
      [login, hashedPassword],
      (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);

        const token = generateToken(64);

        db.run(`UPDATE users SET auth = ? WHERE id = ?`, [token, row.id], (updateErr) => {
          if (updateErr) return reject(updateErr);
          resolve({ token, user: row });
        });
      }
    );
  });
}

module.exports = { loginUser };