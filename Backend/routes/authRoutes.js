const express = require("express");
const router = express.Router();
const { addUser } = require("../DataBase/functions/addUser");
const { isFieldUnique } = require("../DataBase/functions/isFieldUnique");
const { generateToken } = require("../Utils/main");
const { hashPassword } = require("../Utils/hashPassword");
const { loginUser } = require("../DataBase/functions/loginUser");
const { getUserByToken } = require("../DataBase/functions/getUserByToken");
const { existsSync, readFileSync } = require("node:fs");
const path = require("node:path");
const rateLimit = require("express-rate-limit");

const CAPTCHA_SKIP = process.env.VITE_CAPTCHA_SKIP === "true" && process.env.NODE_ENV !== "production";
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

if (!TURNSTILE_SECRET && !CAPTCHA_SKIP) {
  console.error("TURNSTILE_SECRET is not set. CAPTCHA verification will fail.");
}

if (CAPTCHA_SKIP) {
  console.warn("CAPTCHA verification is disabled. This should only be used in development.");
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 attempts per IP
  message: "Too many login attempts. Please try again later.",
});

router.post("/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

router.get("/verify-token", async (req, res) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    let avatarBase64 = null;
    if (user.avatar) {
      const avatarPath = path.join(__dirname, "..", "DataBase", user.avatar);
      if (existsSync(avatarPath)) {
        const avatarFile = readFileSync(avatarPath);
        const avatarExtension = path.extname(user.avatar).substring(1);
        const mimeType = `image/${avatarExtension}`;
        avatarBase64 = `data:${mimeType};base64,${avatarFile.toString("base64")}`;
      }
    }
    res.json({
      userId: user.id,
      login: user.login,
      email: user.email,
      name: user.name,
      surname: user.surname,
      status: user.status,
      avatar: avatarBase64,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function verifyTurnstile(token, remoteIp) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const params = new URLSearchParams();
    params.append("secret", TURNSTILE_SECRET);
    params.append("response", token);
    if (remoteIp) params.append("remoteip", remoteIp);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: params, signal: controller.signal }
    );
    const json = await res.json();
    return json.success;
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

router.post("/login", loginLimiter, async (req, res) => {
  const { username, password, remember, captcha } = req.body;

  if (!CAPTCHA_SKIP && (!captcha || !(await verifyTurnstile(captcha, req.ip)))) {
    return res.status(400).json({ errors: { captcha: "Captcha verification failed" } });
  }

  if (!username || !password) {
    return res.status(400).json({ errors: { login: "Username required", password: "Password required" } });
  }

  try {
    const result = await loginUser(username, password);
    if (!result) {
      return res.status(401).json({ errors: { login: "Invalid login", password: "Invalid password" } });
    }

    const { token, user } = result;
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: remember ? 1000 * 60 * 60 * 24 * 14 : undefined,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    let avatarBase64 = null;
    if (user.avatar) {
      const avatarPath = path.join(__dirname, "..", "DataBase", user.avatar);
      if (existsSync(avatarPath)) {
        const avatarFile = readFileSync(avatarPath);
        const avatarExtension = path.extname(user.avatar).substring(1);
        const mimeType = `image/${avatarExtension}`;
        avatarBase64 = `data:${mimeType};base64,${avatarFile.toString("base64")}`;
      }
    }

    res.json({
      userId: user.id,
      login: user.login,
      email: user.email,
      name: user.name,
      surname: user.surname,
      status: user.status,
      avatar: avatarBase64,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", loginLimiter, async (req, res) => {
  const { login, password, name, surname, offer, captcha } = req.body;

  if (!CAPTCHA_SKIP && (!captcha || !(await verifyTurnstile(captcha, req.ip)))) {
    return res.status(400).json({ errors: { captcha: "Please confirm you are not a robot" } });
  }

  const errors = {};
  if (!offer) errors.offer = "You must agree to the terms";
  if (!login || login.length < 5) errors.login = "Login must be at least 5 characters";
  if (!password || password.length < 5) errors.password = "Password must be at least 5 characters";
  if (!name || name.length < 2) errors.name = "Name must be at least 2 characters";
  if (!surname || surname.length < 2) errors.surname = "Surname must be at least 2 characters";
  if (Object.keys(errors).length) {
    return res.status(400).json({ errors });
  }

  try {
    const isUnique = await isFieldUnique("login", login);
    if (!isUnique) return res.status(400).json({ errors: { login: "Login already exists" } });

    const defaultMail = process.env.DEFAULT_MAIL || "example.com";
    const email = `${login}@${defaultMail}`;
    const token = generateToken(64);
    const hashed = hashPassword(password);
    const userId = await addUser({ email, login, password: hashed, name, surname, token });

    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(201).json({ userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;