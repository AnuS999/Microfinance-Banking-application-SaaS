const GroupLoanApplication = require('../models/GroupLoanApplication');

// 1. Agent submits group members list with KYC for CIBIL approval
exports.submitGroupForApproval = async (req, res) => {
  try {
    const { centerNameOrLocation, members } = req.body;
    const agentId = req.user._id;

    if (!members || members.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one member is required' });
    }

    const newGroupApplication = new GroupLoanApplication({
      agent: agentId,
      centerNameOrLocation,
      members,
      groupStatus: 'PENDING_APPROVAL',
    });

    await newGroupApplication.save();
    res.status(201).json({
      success: true,
      message: 'Group applications submitted successfully for CIBIL verification',
      data: newGroupApplication,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Agent fetches their own submitted group applications & statuses
exports.getAgentGroups = async (req, res) => {
  try {
    const agentId = req.user._id;
    const agentGroups = await GroupLoanApplication.find({ agent: agentId }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: agentGroups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Admin fetches all pending group applications
exports.getPendingGroups = async (req, res) => {
  try {
    const pendingGroups = await GroupLoanApplication.find({ groupStatus: 'PENDING_APPROVAL' })
      .populate('agent', 'name email');
    res.status(200).json({ success: true, data: pendingGroups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Admin updates CIBIL score and approves/rejects members
exports.reviewGroupCibil = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { memberReviews } = req.body; // Array of { memberId, cibilScore, status }

    const groupApp = await GroupLoanApplication.findById(applicationId);
    if (!groupApp) {
      return res.status(404).json({ success: false, message: 'Group application not found' });
    }

    memberReviews.forEach(review => {
      const member = groupApp.members.id(review.memberId);
      if (member) {
        member.cibilScore = review.cibilScore;
        member.status = review.status; // 'APPROVED' or 'REJECTED'
      }
    });

    const allProcessed = groupApp.members.every(m => m.status !== 'PENDING_CIBIL');
    if (allProcessed) {
      const anyApproved = groupApp.members.some(m => m.status === 'APPROVED');
      groupApp.groupStatus = anyApproved ? 'APPROVED' : 'REJECTED';
    }

    await groupApp.save();
    res.status(200).json({
      success: true,
      message: 'CIBIL review processed successfully',
      data: groupApp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};