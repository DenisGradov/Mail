const db = require('../DataBase/db');

function updateOnlineStatus() {
  console.log('🕒 Обновление статуса онлайн для всех пользователей');
  const query = `
    UPDATE users 
    SET online = CASE 
      WHEN last_online IS NOT NULL 
      AND datetime(last_online) >= datetime('now', '-60 seconds') 
      THEN 1 
      ELSE 0 
    END
  `;
  db.run(query, [], (err) => {
    if (err) {
      console.error('❌ Ошибка при обновлении статуса онлайн:', err.message);
    } else {
      console.log('✅ Статусы онлайн обновлены');
    }
  });
}

// Запускаем задачу каждые 10 секунд
function startOnlineStatusUpdater() {
  updateOnlineStatus(); // Выполнить сразу при старте
  setInterval(updateOnlineStatus, 10000); // Повторять каждые 10 секунд
}

module.exports = { startOnlineStatusUpdater };