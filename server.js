const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

// Connect to MongoDB Database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Microfinance SaaS API Server Running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));