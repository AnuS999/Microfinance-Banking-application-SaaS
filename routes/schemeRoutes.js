const express = require('express');
const router = express.Router();
const { createScheme, getSchemes } = require('../controllers/schemeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .post(authorize('ORG_ADMIN'), createScheme)
  .get(getSchemes);

module.exports = router;