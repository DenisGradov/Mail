const db = require('../db');

function initializeEmailsTable() {
  const queryEmails = `
    CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY,
      favorite INTEGER DEFAULT 0,
      viewed INTEGER DEFAULT 0,
      from_address TEXT,
      to_address TEXT,
      subject TEXT,
      date TEXT,
      message_id TEXT UNIQUE,
      in_reply_to TEXT,
      references TEXT,
      content_type TEXT,
      text_content TEXT,
      html_content TEXT
    );
  `;
  const queryAttach = `
    CREATE TABLE IF NOT EXISTS attachments (
      id INTEGER PRIMARY KEY,
      email_id INTEGER,
      filename TEXT,
      content_type TEXT,
      size INTEGER,
      path TEXT,
      FOREIGN KEY(email_id) REFERENCES emails(id)
    );
  `;

  db.serialize(() => {
    db.run(queryEmails);
    db.run(queryAttach);
  });
}

module.exports = { initializeEmailsTable };
