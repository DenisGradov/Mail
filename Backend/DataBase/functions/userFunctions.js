const db = require('../db');

async function getUsers(limit, offset, search) {
  return new Promise((resolve, reject) => {
    let query = `
        SELECT id, email, login, password, status, name, surname, avatar
        FROM users
        WHERE 1=1
    `;
    const params = [];
    if (search) {
      query += ` AND (login LIKE ? OR email LIKE ? OR name LIKE ? OR surname LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }
    if (limit !== 'all') {
      query += ` LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), parseInt(offset));
    }
    db.all(query, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function getUsersCount(search) {
  return new Promise((resolve, reject) => {
    let query = `SELECT COUNT(*) as count FROM users WHERE 1=1`;
    const params = [];
    if (search) {
      query += ` AND (login LIKE ? OR email LIKE ? OR name LIKE ? OR surname LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }
    db.get(query, params, (err, row) => {
      if (err) return reject(err);
      resolve(row.count);
    });
  });
}

async function addUser({ email, login, password, status, name, surname }) {
  return new Promise((resolve, reject) => {
    const query = `
        INSERT INTO users (email, login, password, status, name, surname, avatar, auth, logs, emails, sent_emails, lastAsset, blocked, two_factor_secret, two_factor_enabled, online)
        VALUES (?, ?, ?, ?, ?, ?, 'none', '', '', '[]', '[]', '', 0, '', 0, 0)
    `;
    db.run(query, [email, login, password, status, name || '', surname || ''], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

async function deleteUsers(userIds) {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM users WHERE id IN (${userIds.map(() => '?').join(',')})`;
    db.run(query, userIds, function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

async function updateUserStatus(userIds, status) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users SET status = ? WHERE id IN (${userIds.map(() => '?').join(',')})`;
    db.run(query, [status, ...userIds], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

async function getUserById(userId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE id = ?`;
    db.get(query, [userId], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

async function getOnlineUsersCount() {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as count FROM users WHERE online = 1`;
    db.get(query, [], (err, row) => {
      if (err) return reject(err);
      resolve(row.count);
    });
  });
}

async function getFrozenUsersCount() {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as count FROM users WHERE status = 0`;
    db.get(query, [], (err, row) => {
      if (err) return reject(err);
      resolve(row.count);
    });
  });
}

async function getUsersWith2FACount() {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as count FROM users WHERE two_factor_enabled = 1`;
    db.get(query, [], (err, row) => {
      if (err) return reject(err);
      resolve(row.count);
    });
  });
}

async function getReceivedEmailsCount() {
  return new Promise((resolve, reject) => {
    const query = `SELECT emails FROM users`;
    db.all(query, [], (err, rows) => {
      if (err) return reject(err);
      let total = 0;
      rows.forEach((row) => {
        try {
          const emails = row.emails ? JSON.parse(row.emails) : [];
          total += emails.length;
        } catch {
          // Игнорируем некорректный JSON
        }
      });
      resolve(total);
    });
  });
}

async function getSentEmailsCount() {
  return new Promise((resolve, reject) => {
    const query = `SELECT sent_emails FROM users`;
    db.all(query, [], (err, rows) => {
      if (err) return reject(err);
      let total = 0;
      rows.forEach((row) => {
        try {
          const sentEmails = row.sent_emails ? JSON.parse(row.sent_emails) : [];
          total += sentEmails.length;
        } catch {
          // Игнорируем некорректный JSON
        }
      });
      resolve(total);
    });
  });
}

module.exports = {
  getUsers,
  getUsersCount,
  addUser,
  deleteUsers,
  updateUserStatus,
  getUserById,
  getOnlineUsersCount,
  getFrozenUsersCount,
  getUsersWith2FACount,
  getReceivedEmailsCount,
  getSentEmailsCount,
};