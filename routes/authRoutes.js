const express = require('express');
const router = express.Router();
const { registerTenant, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public Routes
router.post('/register-tenant', registerTenant);
router.post('/login', loginUser);

// Protected Auth Route
router.get('/me', protect, getMe);

module.exports = router;