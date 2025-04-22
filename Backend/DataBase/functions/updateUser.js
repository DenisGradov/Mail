const db = require("../db");

async function updateUser(id, updatedData) {
  let query = "UPDATE users SET ";
  let params = [];

  // Строим запрос с динамическими полями
  if (updatedData.name) {
    query += "name = ?, ";
    params.push(updatedData.name);
  }
  if (updatedData.surname) {
    query += "surname = ?, ";
    params.push(updatedData.surname);
  }
  if (updatedData.login) {
    query += "login = ?, ";
    params.push(updatedData.login);
  }
  if (updatedData.password) {
    query += "password = ?, ";
    params.push(updatedData.password);
  }

  query = query.slice(0, -2); // Убираем последнюю запятую
  query += " WHERE id = ?"; // Добавляем условие для ID

  params.push(id);

  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) return reject(err);
      resolve(this.changes); // Возвращаем количество измененных строк
    });
  });
}

module.exports = { updateUser };
