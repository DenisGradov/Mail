const db = require('../db');

async function setEmailViewed(userId, mailId, viewed) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT emails FROM users WHERE id = ?`, [userId], (err, row) => {
      if (err) return reject(err);

      const list = row.emails ? JSON.parse(row.emails) : [];

      const updated = list.map(m => {
        if (m.id === mailId) {
          return { ...m, viewed: !!viewed };
        }
        return m;
      });

      const json = JSON.stringify(updated);

      db.run(`UPDATE users SET emails = ? WHERE id = ?`, [json, userId], (err2) => {
        if (err2) return reject(err2);

        const mail = updated.find(m => m.id === mailId);
        resolve(mail);
      });
    });
  });
}

module.exports = { setEmailViewed };
