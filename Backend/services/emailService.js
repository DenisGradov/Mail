const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
});

async function sendEmail({ from = process.env.DEFAULT_MAIL, to, subject, text, html }) {
  return transporter.sendMail({ from, to, subject, text, html });
}

module.exports = { sendEmail };
