const db = require('../db');

async function addDomain(userId, domain) {
  return new Promise((resolve, reject) => {
    const query = `
        INSERT INTO domains (user_id, domain)
        VALUES (?, ?)
    `;
    db.run(query, [userId, domain], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

async function deleteDomain(userId, domain) {
  return new Promise((resolve, reject) => {
    const query = `
        DELETE FROM domains WHERE user_id = ? AND domain = ?
    `;
    db.run(query, [userId, domain], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

async function getUserDomains(userId) {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT domain FROM domains WHERE user_id = ?
    `;
    db.all(query, [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows.map(row => row.domain));
    });
  });
}

module.exports = { addDomain, deleteDomain, getUserDomains };