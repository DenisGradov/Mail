const db = require('../db');

async function setEmailFavorite(userId, mailId, favorite) {
  return new Promise((resolve, reject) => {
    // Получаем JSON‐массив писем
    db.get(
      `SELECT emails FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) return reject(err);
        const list = row.emails ? JSON.parse(row.emails) : [];
        // Ищем нужное письмо
        const updated = list.map(m => {
          if (m.id === mailId) {
            return { ...m, favorite: !!favorite };
          }
          return m;
        });
        // Сохраняем обратно
        const json = JSON.stringify(updated);
        db.run(
          `UPDATE users SET emails = ? WHERE id = ?`,
          [json, userId],
          (err2) => {
            if (err2) return reject(err2);
            // Возвращаем обновлённое письмо
            const mail = updated.find(m => m.id === mailId);
            resolve(mail);
          }
        );
      }
    );
  });
}

module.exports = { setEmailFavorite };
