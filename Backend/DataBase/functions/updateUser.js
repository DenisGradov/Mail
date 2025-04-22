const db = require("../db");

async function updateUser(id, updatedData) {
  let query = "UPDATE users SET ";
  let params = [];
  const fieldsToUpdate = [];

  if (updatedData.name) {
    fieldsToUpdate.push("name = ?");
    params.push(updatedData.name);
  }
  if (updatedData.surname) {
    fieldsToUpdate.push("surname = ?");
    params.push(updatedData.surname);
  }
  if (updatedData.login) {
    fieldsToUpdate.push("login = ?");
    params.push(updatedData.login);
  }
  if (updatedData.password) {
    fieldsToUpdate.push("password = ?");
    params.push(updatedData.password);
  }
  if (updatedData.avatar) {
    fieldsToUpdate.push("avatar = ?");
    params.push(updatedData.avatar);
  }

  if (fieldsToUpdate.length === 0) {
    return 0; // No changes to apply
  }

  query += fieldsToUpdate.join(", ");
  query += " WHERE id = ?";
  params.push(id);

  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

module.exports = { updateUser };