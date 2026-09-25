const express = require('express');
const router = express.Router();
const { recordCollection, getAllCollections } = require('../controllers/repaymentController');

// Route to record a new EMI collection
router.post('/collect', recordCollection);

// Route to fetch all collection logs
router.get('/all', getAllCollections);

module.exports = router;