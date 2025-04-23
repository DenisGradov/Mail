const db = require('../db');

function initializeDB() {
  const query = `
      CREATE TABLE IF NOT EXISTS users
      (
          id
          INTEGER
          PRIMARY
          KEY
          AUTOINCREMENT,
          email
          TEXT,
          login
          TEXT,
          password
          TEXT,
          status
          INTEGER,
          name
          TEXT,
          surname
          TEXT,
          avatar
          TEXT,
          auth
          TEXT,
          logs
          TEXT,
          emails
          TEXT,
          sent_emails
          TEXT,
          lastAsset
          TEXT,
          blocked
          INTEGER,
          two_factor_secret
          TEXT,
          two_factor_enabled
          INTEGER
          DEFAULT
          0
      )
  `;
  db.run(query, (err) => {
    if (err) console.error('❌ Ошибка создания таблицы users:', err.message);
    else console.log('🧱 Таблица users готова');
  });
}

module.exports = {initializeDB};