const express = require('express');
const router = express.Router();
const MasterDropdown = require('../models/MasterDropdown');

// 1. GET: Saari categories ya specific category ke options fetch karne ke liye
// Example: /api/master-dropdowns?category=identity
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) {
      filter.category = category.toLowerCase().trim();
    }
    const options = await MasterDropdown.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: options });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. POST: Naya option ya category add karne ke liye
router.post('/', async (req, res) => {
  try {
    const { category, name, status } = req.body;

    if (!category || !name) {
      return res.status(400).json({ success: false, message: 'Category and name are required' });
    }

    const newItem = new MasterDropdown({
      category: category.toLowerCase().trim(),
      name: name.trim(),
      status: status || 'Active'
    });

    const savedItem = await newItem.save();
    res.status(201).json({ success: true, data: savedItem });
  } catch (err)  {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. DELETE: Kisi option ko delete karne ke liye
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await MasterDropdown.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'Option not found' });
    }

    res.status(200).json({ success: true, message: 'Option deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;