const express = require('express');
const router = express.Router();
const { registerTenant, loginUser } = require('../controllers/authController');

router.post('/register-tenant', registerTenant);
router.post('/login', loginUser);

module.exports = router;