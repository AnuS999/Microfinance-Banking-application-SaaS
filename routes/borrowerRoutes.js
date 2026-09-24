const express = require('express');
const router = express.Router();
const { getBorrowers, createBorrower, deleteBorrower } = require('../controllers/borrowerController');

router.route('/')
  .get(getBorrowers)
  .post(createBorrower);

router.route('/:id')
  .delete(deleteBorrower);

module.exports = router;