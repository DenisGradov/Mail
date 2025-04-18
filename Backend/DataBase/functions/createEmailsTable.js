const db = require('../db');

function initializeEmailsTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT NOT NULL,
      recipient TEXT NOT NULL,
      subject TEXT,
      body TEXT,
      receivedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

module.exports = { initializeEmailsTable };
