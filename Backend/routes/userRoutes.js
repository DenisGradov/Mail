const express = require("express");
const router = express.Router();
const { getUserByToken } = require("../DataBase/functions/getUserByToken");
const { loginUser } = require("../DataBase/functions/loginUser"); // Импортируем loginUser
const { hashPassword } = require("../Utils/hashPassword");
const { updateUser } = require("../DataBase/functions/updateUser");
const { isFieldUnique } = require("../DataBase/functions/isFieldUnique");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {existsSync, readFileSync} = require("node:fs");

const upload = multer({
  dest: 'DataBase/avatars/',  // Папка для загрузки аватаров
  limits: { fileSize: 10 * 1024 * 1024 },  // Максимальный размер 10 MB
  fileFilter: (req, file, cb) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  }
}).single('avatar');  // Название поля, по которому загружается файл


// Загрузка аватара
router.post('/upload-avatar', upload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" }); // Возвращаем ошибку, если файл не передан
  }

  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Недействительный токен" });
    }

    const fileExtension = path.extname(req.file.originalname); // Получаем расширение файла
    const fileName = `${user.id}${fileExtension}`; // Название файла: ID пользователя + расширение
    const filePath = path.join(__dirname, "..", "DataBase", "avatars", fileName);

    // Перемещаем файл в папку avatars
    try {
      fs.renameSync(req.file.path, filePath);
    } catch (err) {
      console.error("Ошибка при сохранении файла:", err);
      return res.status(500).json({ error: "Не удалось сохранить аватарку" });
    }

    // Проверяем, существует ли файл
    if (!existsSync(filePath)) {
      console.error("Файл аватарки не найден после сохранения:", filePath);
      return res.status(500).json({ error: "Ошибка при сохранении аватарки" });
    }

    const avatarUrl = `/avatars/${fileName}`;
    await updateUser(user.id, { avatar: avatarUrl });
    let avatarBase64 = null;
    const avatarPath = path.join(__dirname, '..', 'DataBase', avatarUrl);
    if (existsSync(avatarPath)) {
      const avatarFile = readFileSync(avatarPath);
      const avatarExtension = path.extname(user.avatar).substring(1);
      const mimeType = `image/${avatarExtension}`;
      avatarBase64 = `data:${mimeType};base64,${avatarFile.toString('base64')}`;
    }
    console.log("Аватарка успешно сохранена:", avatarUrl);
    res.status(200).json({ success: true, avatar: avatarBase64 });
  } catch (err) {
    console.error("Ошибка при загрузке аватарки:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});




router.post("/update", async (req, res) => {
  const { oldPassword, newPassword, login, name, surname, avatar } = req.body;
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

    if (login && login !== user.login) {
      const isUnique = await isFieldUnique("login", login);
      if (!isUnique) {
        return res.status(200).json({ success: false, message: "Login already exists" });
      }
      updatedData.login = login;
    }

    if (name && name !== user.name) updatedData.name = name;

    if (surname && surname !== user.surname) updatedData.surname = surname;

    if (oldPassword && newPassword) {
      if (oldPassword === newPassword) {
        return res.status(200).json({ success: false, message: "New password cannot be the same as old password" });
      }

      const result = await loginUser(user.login, oldPassword);

      if (!result) {
        return res.status(200).json({ success: false, message: "Old password is incorrect" });
      }

      updatedData.password = hashPassword(newPassword);

      const { token: newToken } = result;
      res.cookie("auth_token", newToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: "Lax",
        secure: false,
      });
    }

    if (avatar && avatar !== user.avatar) {
      updatedData.avatar = avatar;
    }

    if (Object.keys(updatedData).length === 0 && !avatar) {
      return res.status(200).json({ success: false, message: "No data to update" });
    }

    const updateResult = await updateUser(user.id, updatedData);

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
