const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { recordCollection, getAllCollections } = require('../controllers/repaymentController');

router.use(protect);

// Route to record a new EMI collection
router.post('/collect', recordCollection);

// Route to fetch all collection logs
router.get('/all', getAllCollections);

module.exports = router;