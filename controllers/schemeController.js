const LoanScheme = require('../models/LoanScheme');

// @desc    Create a new Loan Scheme
// @route   POST /api/schemes
// @access  Private (ORG_ADMIN)
const createScheme = async (req, res) => {
  try {
    const {
      name,
      minAmount,
      maxAmount,
      interestRate,
      interestType,
      repaymentFrequency,
      minTenorMonths,
      maxTenorMonths,
      processingFeePercent,
    } = req.body;

    const existingScheme = await LoanScheme.findOne({
      tenantId: req.user.tenantId,
      name,
    });

    if (existingScheme) {
      return res.status(400).json({ message: 'Scheme name already exists in your organization' });
    }

    const scheme = await LoanScheme.create({
      tenantId: req.user.tenantId,
      name,
      minAmount,
      maxAmount,
      interestRate,
      interestType,
      repaymentFrequency,
      minTenorMonths,
      maxTenorMonths,
      processingFeePercent,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: scheme });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Loan Schemes for logged-in Tenant
// @route   GET /api/schemes
// @access  Private
const getSchemes = async (req, res) => {
  try {
    const schemes = await LoanScheme.find({
      tenantId: req.user.tenantId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: schemes.length, data: schemes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createScheme, getSchemes };