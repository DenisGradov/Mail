const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../..', '.env.backend') });

const SALT = process.env.HASH_SALT || 'asdqwdasdqwdasd123asd1231qwdasdsdwdsadwdasd';

function hashPassword(password) {
  return crypto
    .createHmac('sha256', SALT)
    .update(password)
    .digest('hex');
}

function comparePassword(enteredPassword, storedPassword) {
  const hashedEnteredPassword = hashPassword(enteredPassword);
  return hashedEnteredPassword === storedPassword;
}

module.exports = { hashPassword, comparePassword };
