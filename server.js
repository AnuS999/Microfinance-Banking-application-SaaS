const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const borrowerRoutes = require('./routes/borrowerRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const loanRoutes = require('./routes/loanRoutes');

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/loans', loanRoutes);

// Root Route for Health Check
app.get('/', (req, res) => {
  res.send('Microfinance Banking SaaS API is active');
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});