const express = require('express');
const router = express.Router();
const {
  applyForLoan,
  getLoans,
  getLoanById,
  approveLoan,
  disburseLoan,
  repayInstallment,
} = require('../controllers/loanController');

const { protect } = require('../middleware/auth');

// Protect all routes with JWT Authentication
router.use(protect);

// Base Loan Routes: GET all loans & POST apply for new loan
router.route('/')
  .post(applyForLoan)
  .get(getLoans);

// Single Loan Route: GET loan details by ID
router.route('/:id')
  .get(getLoanById);

// State Machine Transition Routes
router.patch('/:id/approve', approveLoan);
router.patch('/:id/disburse', disburseLoan);

// Repayment / EMI Collection Route
router.post('/:id/repay', repayInstallment);

module.exports = router;