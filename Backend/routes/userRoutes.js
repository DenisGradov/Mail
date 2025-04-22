const express = require("express");
const router = express.Router();
const { getUserByToken } = require("../DataBase/functions/getUserByToken");
const { loginUser } = require("../DataBase/functions/loginUser"); // Импортируем loginUser
const { hashPassword } = require("../Utils/hashPassword");
const { updateUser } = require("../DataBase/functions/updateUser");
const { isFieldUnique } = require("../DataBase/functions/isFieldUnique");

router.post("/update", async (req, res) => {
  const { oldPassword, newPassword, login, name, surname } = req.body;
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(200).json({ success: false, message: "No token provided" });
  }

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(200).json({ success: false, message: "Invalid token" });
    }

    const updatedData = {};

    // Проверяем уникальность нового логина
    if (login && login !== user.login) {
      const isUnique = await isFieldUnique("login", login);
      if (!isUnique) {
        return res.status(200).json({ success: false, message: "Login already exists" });
      }
      updatedData.login = login;
    }

    // Обновляем другие поля, если они были переданы
    if (name && name !== user.name) updatedData.name = name;
    if (surname && surname !== user.surname) updatedData.surname = surname;

    // Если новый пароль передан, проверяем старый
    if (oldPassword && newPassword) {

      if (oldPassword === newPassword) {
        return res.status(200).json({ success: false, message: "New password cannot be the same as old password" });
      }

      const result = await loginUser(user.login, oldPassword);

      if (!result) {
        return res.status(200).json({ success: false, message: "Old password is incorrect" });
      }

      // Хешируем новый пароль и добавляем в обновленные данные
      updatedData.password = hashPassword(newPassword);

      // Обновляем токен после успешной проверки пароля
      const { token: newToken } = result; // Новая переменная для нового токена
      res.cookie("auth_token", newToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: "Lax",
        secure: false,
      });
    }

    // Если данных для обновления нет, возвращаем ошибку
    if (Object.keys(updatedData).length === 0) {
      return res.status(200).json({ success: false, message: "No data to update" });
    }

    // Обновляем пользователя в базе
    const updateResult = await updateUser(user.id, updatedData);

    // Проверяем, был ли успешно обновлен пользователь
    if (updateResult === 0) {
      return res.status(200).json({ success: false, message: "Failed to update user" });
    }

    res.status(200).json({ success: true, message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(200).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
