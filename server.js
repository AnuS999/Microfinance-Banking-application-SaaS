const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const borrowerRoutes = require('./routes/borrowerRoutes'); // NEW

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/borrowers', borrowerRoutes); // NEW

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Microfinance SaaS API Running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));