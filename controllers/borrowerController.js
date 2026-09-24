const Borrower = require('../models/Borrower');

// @desc    Get all borrowers
// @route   GET /api/borrowers
exports.getBorrowers = async (req, res, next) => {
  try {
    const borrowers = await Borrower.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: borrowers.length, data: borrowers });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new borrower
// @route   POST /api/borrowers
exports.createBorrower = async (req, res, next) => {
  try {
    const borrower = await Borrower.create(req.body);
    res.status(201).json({ success: true, data: borrower });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete borrower
// @route   DELETE /api/borrowers/:id
exports.deleteBorrower = async (req, res, next) => {
  try {
    const borrower = await Borrower.findByIdAndDelete(req.params.id);
    if (!borrower) {
      return res.status(404).json({ success: false, message: 'Borrower not found' });
    }
    res.status(200).json({ success: true, message: 'Borrower deleted successfully' });
  } catch (error) {
    next(error);
  }
};