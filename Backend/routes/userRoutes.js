const express = require("express");
const router = express.Router();
const { getUserByToken } = require("../DataBase/functions/getUserByToken");
const { hashPassword } = require("../Utils/hashPassword");
const { isFieldUnique } = require("../DataBase/functions/isFieldUnique");
const { getUsers, getUsersCount, addUser, deleteUsers, updateUserStatus, getUserById, getOnlineUsersCount,
  getFrozenUsersCount, getUsersWith2FACount, getReceivedEmailsCount, getSentEmailsCount
} = require("../DataBase/functions/userFunctions");
const { getUserDomains } = require("../DataBase/functions/domainFunctions");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { existsSync, readFileSync } = require("node:fs");
const db = require("../DataBase/db");

const upload = multer({
  dest: 'DataBase/avatars/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  }
}).single('avatar');

router.post('/upload-avatar', upload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `${user.id}${fileExtension}`;
    const filePath = path.join(__dirname, "..", "DataBase", "avatars", fileName);
    fs.renameSync(req.file.path, filePath);
    const avatarUrl = `/avatars/${fileName}`;
    const updateResult = await updateUser(user.id, { avatar: avatarUrl });
    if (updateResult === 0) {
      return res.status(500).json({ error: "Failed to update avatar" });
    }
    let avatarBase64 = null;
    if (existsSync(filePath)) {
      const avatarFile = readFileSync(filePath);
      const mimeType = `image/${fileExtension.substring(1)}`;
      avatarBase64 = `data:${mimeType};base64,${avatarFile.toString('base64')}`;
    }
    res.status(200).json({ success: true, avatar: avatarBase64 });
  } catch (err) {
    console.error("Error uploading avatar:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/update", async (req, res) => {
  const { oldPassword, newPassword, login, name, surname, avatar } = req.body;
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const updatedData = {};
    if (login && login !== user.login) {
      const isUnique = await isFieldUnique("login", login);
      if (!isUnique) {
        return res.status(400).json({ error: "Login already exists" });
      }
      updatedData.login = login;
    }
    if (name && name !== user.name) updatedData.name = name;
    if (surname && surname !== user.surname) updatedData.surname = surname;
    if (oldPassword && newPassword) {
      const result = await loginUser(user.login, oldPassword);
      if (!result) {
        return res.status(400).json({ error: "Old password is incorrect" });
      }
      updatedData.password = hashPassword(newPassword);
    }
    if (avatar && avatar !== user.avatar) {
      updatedData.avatar = avatar;
    }
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: "No data to update" });
    }
    const updateResult = await updateUser(user.id, updatedData);
    if (updateResult === 0) {
      return res.status(500).json({ error: "Failed to update user" });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users", async (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (user.status !== 2 && user.status !== 3) {
      return res.status(403).json({ error: "Admin or coder access required" });
    }
    const { limit = 10, page = 1, search = '' } = req.query;
    const offset = (page - 1) * (limit === 'all' ? 0 : parseInt(limit));
    const users = await getUsers(limit, offset, search);
    const total = await getUsersCount(search);
    res.status(200).json({ users, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/add", async (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (user.status !== 2 && user.status !== 3) {
      return res.status(403).json({ error: "Admin or coder access required" });
    }
    const { email, login, password, status, name, surname } = req.body;
    if (!email || !login || !password || status === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (!login.match(/^[a-zA-Z0-9._-]{5,}$/)) {
      return res.status(400).json({ error: "Login must be at least 5 characters" });
    }
    if (password.length < 5) {
      return res.status(400).json({ error: "Password must be at least 5 characters" });
    }
    const isLoginUnique = await isFieldUnique("login", login);
    if (!isLoginUnique) {
      return res.status(400).json({ error: "Login already exists" });
    }
    const isEmailUnique = await isFieldUnique("email", email);
    if (!isEmailUnique) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = hashPassword(password);
    const userId = await addUser({ email, login, password: hashedPassword, status, name, surname });
    res.status(201).json({ success: true, userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/delete", async (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (user.status !== 2 && user.status !== 3) {
      return res.status(403).json({ error: "Admin or coder access required" });
    }
    const { userIds } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }
    const users = await Promise.all(userIds.map(id => getUserById(id)));
    const invalidUsers = users.filter(u => u && (u.status === 2 && user.status !== 3));
    if (invalidUsers.length > 0) {
      return res.status(403).json({ error: "Cannot delete admins unless you are a coder" });
    }
    const changes = await deleteUsers(userIds);
    if (changes === 0) {
      return res.status(404).json({ error: "No users deleted" });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/update-status", async (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (user.status !== 2 && user.status !== 3) {
      return res.status(403).json({ error: "Admin or coder access required" });
    }
    const { userIds, status } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0 || ![0, 1].includes(status)) {
      return res.status(400).json({ error: "Invalid user IDs or status" });
    }
    const users = await Promise.all(userIds.map(id => getUserById(id)));
    const invalidUsers = users.filter(u => u && (u.status === 2 && user.status !== 3));
    if (invalidUsers.length > 0) {
      return res.status(403).json({ error: "Cannot modify admins unless you are a coder" });
    }
    const changes = await updateUserStatus(userIds, status);
    if (changes === 0) {
      return res.status(404).json({ error: "No users updated" });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats", async (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (user.status !== 2 && user.status !== 3) {
      return res.status(403).json({ error: "Admin or coder access required" });
    }

    await db.run(`UPDATE users SET last_online = ? WHERE id = ?`, [new Date().toISOString(), user.id]);

    const totalUsers = await getUsersCount('');
    const onlineUsers = await getOnlineUsersCount();
    const frozenUsers = await getFrozenUsersCount();
    const usersWith2FA = await getUsersWith2FACount();
    const receivedEmails = await getReceivedEmailsCount();
    const sentEmails = await getSentEmailsCount();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        onlineUsers,
        frozenUsers,
        usersWith2FA,
        receivedEmails,
        sentEmails,
      },
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;