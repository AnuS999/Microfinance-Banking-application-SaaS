const Repayment = require('../models/Repayment');
const LoanApplication = require('../models/LoanApplication');

// Record new EMI Collection
exports.recordCollection = async (req, res) => {
  try {
    const { memberId, installmentNo, emiAmount, collectedBy, paymentMode } = req.body;
    
    const member = await LoanApplication.findById(memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const repayment = new Repayment({
      memberId,
      memberName: member.memberName,
      branchName: member.branchName,
      installmentNo,
      emiAmount,
      collectedBy,
      paymentMode
    });

    await repayment.save();

    // Update pending EMIs count in loan application if needed
    member.pendingEmis = Math.max(0, (member.pendingEmis || 50) - 1);
    await member.save();

    res.status(201).json({ success: true, message: 'EMI Collected Successfully', data: repayment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all collections log
exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Repayment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: collections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};