const express = require('express');
const router = express.Router();
const { addUser } = require('../DataBase/functions/addUser');
const { isFieldUnique } = require('../DataBase/functions/isFieldUnique');
const { generateToken } = require('../Utils/main');
const { hashPassword } = require('../Utils/hashPassword');
const {loginUser} = require("../DataBase/functions/loginUser");
const {getUserByToken} = require("../DataBase/functions/getUserByToken");
const domain = process.env.defaultMail;


router.post('/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
  });

  res.status(200).json({ message: 'Logged out successfully' });
});


router.get('/verify-token', async (req, res) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.status(200).json({
      message: 'Token is valid',
      userId: user.id,
      login: user.login,
      email: user.email,
      name: user.name,
      surname: user.surname,
      status: user.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password, remember } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const result = await loginUser(username, password);

    if (!result) {
      return res.status(401).json({ error: 'Invalid login or password' });
    }

    const { token, user } = result;

    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: remember ? 1000 * 60 * 60 * 24 * 14 : undefined,
      sameSite: 'Lax',
      secure: false,
    });

    res.status(200).json({
      message: 'Login successful',
      userId: user.id,
      login: user.login,
      email: user.email,
      name: user.name,
      surname: user.surname,
      status: user.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/register', async (req, res) => {
  const { login, password, name, surname, offer } = req.body;
  const errors = {};

  if (!offer) errors.offer = 'You must agree to the terms';
  if (!login || login.length < 5) errors.login = 'Login must be at least 5 characters';
  if (!password || password.length < 5) errors.password = 'Password must be at least 5 characters';
  if (!name || name.length < 2) errors.name = 'Name must be at least 2 characters';
  if (!surname || surname.length < 2) errors.surname = 'Surname must be at least 2 characters';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const isLoginUnique = await isFieldUnique('login', login);

    if (!isLoginUnique) errors.login = 'Login already exists';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const email = `${login}@${process.env.defaulMail}`;
    const token = generateToken(64);
    const hashedPassword = hashPassword(password);

    const userId = await addUser({ email, login, password: hashedPassword, name, surname, token });

    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14, // 2 недели
      sameSite: 'Lax',
      secure: false,
    });

    res.status(201).json({ message: 'Registration successful', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
