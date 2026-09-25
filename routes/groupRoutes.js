const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  submitGroupForApproval, 
  getPendingGroups, 
  reviewGroupCibil,
  getAgentGroups
} = require('../controllers/groupController');

// Agent Routes
router.post('/submit-group', protect, submitGroupForApproval);

// Agent Route to track submitted groups status
router.get('/agent-groups', protect, getAgentGroups);

// Admin Routes
router.get('/pending-groups', protect, authorize('ADMIN'), getPendingGroups);
router.put('/review-group/:applicationId', protect, authorize('ADMIN'), reviewGroupCibil);

module.exports = router;