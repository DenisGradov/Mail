const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error('❌ Ошибка подключения к базе:', err.message);
  console.log('✅ SQLite база данных подключена');
});

module.exports = db;
