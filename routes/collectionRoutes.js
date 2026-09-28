const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');

// POST: Save new collection / repayment entry
router.post('/create', async (req, res) => {
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
      collectedBy
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

// GET: Fetch collections by center or date
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: collections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;