const db = require('../db');

/**
 * Проверка уникальности значения в поле.
 * @param {string} field - поле (например, 'login')
 * @param {string|number} value - значение
 * @param {number|null} excludeUserId - ID, который нужно исключить (или null)
 * @returns {Promise<boolean>} true если уникально, false если уже есть
 */
async function isFieldUnique(field, value, excludeUserId = null) {
  return new Promise((resolve, reject) => {
    let query = `SELECT 1 FROM users WHERE ${field} = ?`;
    const params = [value];

    if (excludeUserId !== null) {
      query += ` AND id != ?`;
      params.push(excludeUserId);
    }

    db.get(query, params, (err, row) => {
      if (err) return reject(err);
      resolve(!row); // true если уникально
    });
  });
}

module.exports = { isFieldUnique };
