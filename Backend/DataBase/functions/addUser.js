const db = require('../db');

async function addUser({ email, login, password, name, surname, token }) {
  return new Promise((resolve, reject) => {
    const query = `
        INSERT INTO users (email, login, password, status, name, surname, avatar, auth, logs, emails, lastAsset, blocked, two_factor_secret, two_factor_enabled)
        VALUES (?, ?, ?, 1, ?, ?, "none", ?, '', '', '', 0, '', 0)
    `;
    db.run(query, [email, login, password, name, surname, token], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

module.exports = { addUser };