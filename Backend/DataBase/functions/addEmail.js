const db = require('../db');

function addEmail({ sender, recipient, subject, body }) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO emails (sender, recipient, subject, body)
       VALUES (?, ?, ?, ?)`,
      [sender, recipient, subject, body],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      },
    );
  });
}

module.exports = { addEmail };
