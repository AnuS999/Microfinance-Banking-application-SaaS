const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/analyticsController');

router.get('/dashboard', getDashboardMetrics);

module.exports = router;