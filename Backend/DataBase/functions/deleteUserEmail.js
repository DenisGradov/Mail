const db = require('../db');

async function deleteUserEmail(userId, mailIds) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT emails FROM users WHERE id = ?`, [userId], (err, row) => {
      if (err) return reject(err);
      let list = row.emails ? JSON.parse(row.emails) : [];

      const filtered = list.filter(m => !mailIds.includes(m.id));

      if (filtered.length === list.length) return resolve(null); // Не найдено для удаления

      const json = JSON.stringify(filtered);

      db.run(`UPDATE users SET emails = ? WHERE id = ?`, [json, userId], (err2) => {
        if (err2) return reject(err2);
        resolve(filtered);
      });
    });
  });
}

module.exports = { deleteUserEmail };
