const express = require('express');
const router = express.Router();
const {
  createBorrower,
  getBorrowers,
  getBorrowerById,
  updateBorrower,
} = require('../controllers/borrowerController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes with JWT Auth
router.use(protect);

router
  .route('/')
  .post(authorize('ORG_ADMIN', 'LOAN_OFFICER'), createBorrower)
  .get(getBorrowers);

router
  .route('/:id')
  .get(getBorrowerById)
  .put(authorize('ORG_ADMIN', 'LOAN_OFFICER'), updateBorrower);

module.exports = router;