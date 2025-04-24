const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config({ path: path.join(__dirname, '..', 'Frontend', '.env') });

const authRoutes = require('./routes/authRoutes');
const mainRoutes = require('./routes/mainRoutes');
const mailRoutes = require('./routes/mailRoutes');
const userRoutes = require('./routes/userRoutes');
const { initializeDB } = require('./DataBase/functions/createUsersTable');
const {initializeEmailsTable} = require("./DataBase/functions/createEmailsTable");

const app = express();
const PORT = process.env.BACKEND_PORT || 5005;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., same-origin requests or non-browser clients)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/main', mainRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/users', userRoutes);
app.use("/avatars", express.static(path.join(__dirname, "DataBase/avatars")));

// Add a health-check endpoint for domain validation
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Backend is operational' });
});

initializeDB();


require('./services/smtp');
const {updateUser} = require("./DataBase/functions/updateUser");

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
