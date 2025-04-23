const db = require("../db");

async function getUserByToken(token) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE auth = ?";
    db.get(query, [token], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = { getUserByToken };