const LoanApplication = require('../models/LoanApplication');

// Submit new Loan Application (LOA)
exports.createLoanApplication = async (req, res) => {
  try {
    const newApplication = new LoanApplication(req.body);
    await newApplication.save();
    res.status(201).json({
      success: true,
      message: 'Loan Application (LOA) submitted successfully',
      data: newApplication,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Loan Applications
exports.getAllLoanApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Disbursement Status
exports.updateDisbursementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { disbursementStatus } = req.body;

    const updated = await LoanApplication.findByIdAndUpdate(
      id,
      { disbursementStatus, disbursedBy: req.user._id },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      message: `Loan application marked as ${disbursementStatus}`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};