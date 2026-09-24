const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Item = require('./models/Item'); // Mongoose Item Model import karein

dotenv.config();

// MongoDB Connection
connectDB();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// ITEM ROUTES (MongoDB Database Integration)
// ==========================================

// 1. GET: Fetch all items from MongoDB
app.get('/api/items', async (req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
});

// 2. POST: Add new item to MongoDB
app.post('/api/items', async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and description are required' 
      });
    }

    const newItem = new Item({ title, description });
    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    next(error);
  }
});

// 3. DELETE: Remove item by ID from MongoDB
app.delete('/api/items/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Item deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// OTHER FEATURE ROUTES
// ==========================================
const authRoutes = require('./routes/authRoutes');
const borrowerRoutes = require('./routes/borrowerRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const loanRoutes = require('./routes/loanRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/loans', loanRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('Microfinance Banking SaaS API is active');
});

// Global Error Handler
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