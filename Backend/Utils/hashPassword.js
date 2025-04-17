const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', 'Frontend', '.env') });

const SALT = process.env.HASH_SALT || 'default_salt';

function hashPassword(password) {
  return crypto
    .createHmac('sha256', SALT)
    .update(password)
    .digest('hex');
}

module.exports = { hashPassword };
