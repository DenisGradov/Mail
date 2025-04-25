const db = require('../db');

function initializeDomainsTable() {
  const query = `
      CREATE TABLE IF NOT EXISTS domains
      (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          domain TEXT UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
      )
  `;
  db.run(query, (err) => {
    if (err) console.error('❌ Ошибка создания таблицы domains:', err.message);
    else console.log('🧱 Таблица domains готова');
  });
}

module.exports = { initializeDomainsTable };