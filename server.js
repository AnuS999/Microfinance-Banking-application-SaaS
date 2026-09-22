const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Database Connection
connectDB();

const app = express();

// Body Parser Middlewares (Routes se pehle aana zaroori hai)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes Mount
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Microfinance SaaS API Running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));