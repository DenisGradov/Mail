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
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const CAPTCHA_SKIP = process.env.VITE_CAPTCHA_SKIP === "true" && process.env.NODE_ENV !== "production";
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

if (!TURNSTILE_SECRET && !CAPTCHA_SKIP) {
  console.error("TURNSTILE_SECRET is not set. CAPTCHA verification will fail.");
}

if (CAPTCHA_SKIP) {
  console.warn("CAPTCHA verification is disabled. This should only be used in development.");
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 20, // Максимум 10 попыток
  message: { errors: { general: "Too many login attempts. Please try again later." } }, // JSON вместо строки
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
      two_factor_enabled: user.two_factor_enabled,
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
  const { username, password, remember, captcha, totp_code } = req.body;

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

    if (user.two_factor_enabled) {
      if (!totp_code) {
        return res.status(206).json({ two_factor_required: true, userId: user.id });
      }

      const verified = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: "base32",
        token: totp_code,
      });

      if (!verified) {
        return res.status(400).json({ errors: { totp_code: "Invalid 2FA code" } });
      }
    }

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
      two_factor_enabled: user.two_factor_enabled,
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

router.post("/setup-2fa", async (req, res) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const secret = speakeasy.generateSecret({
      name: `StenMail:${user.email}`,
      issuer: "StenMail",
    });

    await require("../DataBase/functions/updateUser").updateUser(user.id, {
      two_factor_secret: secret.base32,
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      qrCode: qrCodeUrl,
      secret: secret.base32,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/verify-2fa", async (req, res) => {
  const { totp_code } = req.body;
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  if (!totp_code) {
    return res.status(400).json({ error: "TOTP code required" });
  }

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: "base32",
      token: totp_code,
    });

    if (!verified) {
      return res.status(400).json({ error: "Invalid 2FA code" });
    }

    await require("../DataBase/functions/updateUser").updateUser(user.id, {
      two_factor_enabled: 1,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/disable-2fa", async (req, res) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    await require("../DataBase/functions/updateUser").updateUser(user.id, {
      two_factor_secret: '',
      two_factor_enabled: 0,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;