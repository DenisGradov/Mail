const db = require('../db');

async function bulkSetViewed(userId, mailIds) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT emails FROM users WHERE id = ?`, [userId], (err, row) => {
      if (err) return reject(err);
      let list = row.emails ? JSON.parse(row.emails) : [];

      // Обновляем только те, что были переданы
      const updated = list.map(m => mailIds.includes(m.id) ? { ...m, viewed: true } : m);
      const json = JSON.stringify(updated);

      db.run(`UPDATE users SET emails = ? WHERE id = ?`, [json, userId], (err2) => {
        if (err2) return reject(err2);
        resolve(updated);
      });
    });
  });
}

module.exports = { bulkSetViewed };
