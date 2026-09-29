const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  submitGroupForApproval, 
  getPendingGroups, 
  reviewGroupCibil,
  getAgentGroups
} = require('../controllers/groupController');

// 📌 Agent Routes (Protected + Role Check for Agents)
router.post('/submit-group', protect, authorize('Agent', 'AGENT', 'agent'), submitGroupForApproval);
router.get('/agent-groups', protect, authorize('Agent', 'AGENT', 'agent'), getAgentGroups);

// 📌 Admin Routes (Protected + Role Check for Admins)
router.get('/pending-groups', protect, authorize('Admin', 'ADMIN', 'admin'), getPendingGroups);
router.put('/review-group/:applicationId', protect, authorize('Admin', 'ADMIN', 'admin'), reviewGroupCibil);

module.exports = router;