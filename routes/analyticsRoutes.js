const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardMetrics } = require('../controllers/analyticsController');

router.get('/dashboard', protect, getDashboardMetrics);

module.exports = router;