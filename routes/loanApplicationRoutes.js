const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createLoanApplication,
  getAllLoanApplications,
  updateDisbursementStatus,
} = require('../controllers/loanApplicationController');

router.post('/create', protect, createLoanApplication);
router.get('/all', protect, getAllLoanApplications);
router.put('/status/:id', protect, authorize('ADMIN'), updateDisbursementStatus);

module.exports = router;