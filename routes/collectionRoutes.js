const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const { protect } = require('../middleware/authMiddleware');

// POST: Save new collection / repayment entry
router.post('/create', protect, async (req, res) => {
  try {
    const { borrowerId, borrowerName, loanId, centerName, dueAmount, paidAmount, paymentMode, collectedBy } = req.body;

    const newCollection = new Collection({
      borrowerId,
      borrowerName,
      loanId,
      centerName,
      dueAmount,
      paidAmount,
      paymentMode,
      collectedBy,
      createdBy: req.user._id // Logged-in user ki ID link ki gayi hai
    });

    await newCollection.save();

    res.status(201).json({ 
      success: true, 
      message: 'Collection recorded successfully!',
      data: newCollection 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET: Fetch collections with data isolation
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    // Agar user Admin nahi hai toh sirf uska banaya data dikhega
    if (req.user.role !== 'Admin' && req.user.role !== 'ADMIN') {
      query.createdBy = req.user._id;
    }
    const collections = await Collection.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: collections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;