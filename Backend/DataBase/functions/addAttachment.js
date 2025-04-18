const db = require('../db');

async function addAttachment({ emailId, filename, contentType, size, path }) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO attachments
        (email_id, filename, content_type, size, path)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [emailId, filename, contentType, size, path], function(err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

module.exports = { addAttachment };
