const express = require('express');
const router = express.Router();

// Aapke auth middleware se protect aur authorize import kiya gaya hai
const { protect, authorize } = require('../middleware/authMiddleware');

// Loan Controller functions import kiye gaye hain
const { 
  requestCollection, 
  approveCollection, 
  rejectCollection 
} = require('../controllers/loanController');

/**
 * @route   POST /api/loans/request-collection
 * @desc    Agent requests EMI collection (Status updates to PENDING_APPROVAL)
 * @access  Private (Agent / Authenticated Users)
 */
router.post('/request-collection', protect, requestCollection);

/**
 * @route   POST /api/loans/approve-collection
 * @desc    Admin approves the EMI collection (Status updates to PAID)
 * @access  Private / Admin Only
 */
router.post('/approve-collection', protect, authorize('ADMIN'), approveCollection);

/**
 * @route   POST /api/loans/reject-collection
 * @desc    Admin rejects the EMI collection (Reverts status back to PENDING)
 * @access  Private / Admin Only
 */
router.post('/reject-collection', protect, authorize('ADMIN'), rejectCollection);

module.exports = router;