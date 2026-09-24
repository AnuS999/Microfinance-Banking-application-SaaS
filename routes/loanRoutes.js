const express = require('express');
const router = express.Router();
const { disburseLoan, getLoans, payInstallment } = require('../controllers/loanController');

router.post('/disburse', disburseLoan);
router.get('/', getLoans);
router.patch('/:loanId/pay/:installmentId', payInstallment);

module.exports = router;