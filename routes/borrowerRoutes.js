const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getBorrowers, createBorrower, deleteBorrower } = require('../controllers/borrowerController');

// Sabhi routes par authentication mandatory kar diya hai
router.use(protect);

router.route('/')
  .get(getBorrowers)
  .post(createBorrower);

router.route('/:id')
  .delete(deleteBorrower);

module.exports = router;