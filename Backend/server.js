const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config({ path: path.join(__dirname, '..', 'Frontend', '.env') });

const authRoutes = require('./routes/authRoutes');
const mailRoutes = require('./routes/mailRoutes');
const userRoutes = require('./routes/userRoutes');
const { initializeDB } = require('./DataBase/functions/createUsersTable');
const {initializeEmailsTable} = require("./DataBase/functions/createEmailsTable");

const app = express();
const PORT = process.env.BACKEND_PORT || 5005;

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(cookieParser());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/users', userRoutes);
app.use("/avatars", express.static(path.join(__dirname, "DataBase/avatars")));
// Создание БД и таблицы
initializeDB();


require('./services/smtp');
const {updateUser} = require("./DataBase/functions/updateUser");

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
