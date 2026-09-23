const LoanApplication = require('../models/LoanApplication');
const LoanScheme = require('../models/LoanScheme');
const Borrower = require('../models/Borrower');

const calculateSchedule = (amount, rate, months) => {
  const totalInterest = (amount * rate * (months / 12)) / 100;
  const totalPayable = amount + totalInterest;
  const monthlyInstallment = totalPayable / months;

  const monthlyPrincipal = amount / months;
  const monthlyInterest = totalInterest / months;

  const schedule = [];
  const today = new Date();

  for (let i = 1; i <= months; i++) {
    const dueDate = new Date(today);
    dueDate.setMonth(today.getMonth() + i);

    schedule.push({
      installmentNumber: i,
      dueDate,
      principalComponent: Math.round(monthlyPrincipal),
      interestComponent: Math.round(monthlyInterest),
      totalInstallmentAmount: Math.round(monthlyInstallment),
      status: 'PENDING',
    });
  }

  return { totalInterest, totalPayable, schedule };
};

// @desc    Apply for a new Loan
// @route   POST /api/loans
// @access  Private (ORG_ADMIN, LOAN_OFFICER)
const applyForLoan = async (req, res) => {
  try {
    const { borrowerId, schemeId, loanAmount, requestedAmount, tenorMonths } = req.body;
    const finalAmount = requestedAmount || loanAmount;

    if (!finalAmount) {
      return res.status(400).json({ message: 'Please specify requested loan amount' });
    }

    const borrower = await Borrower.findOne({ _id: borrowerId, tenantId: req.user.tenantId });
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found in your organization' });
    }

    const scheme = await LoanScheme.findOne({ _id: schemeId, tenantId: req.user.tenantId, isActive: true });
    if (!scheme) {
      return res.status(404).json({ message: 'Loan scheme not found or inactive' });
    }

    if (finalAmount < scheme.minAmount || finalAmount > scheme.maxAmount) {
      return res.status(400).json({
        message: `Loan amount must be between ${scheme.minAmount} and ${scheme.maxAmount}`,
      });
    }

    if (tenorMonths < scheme.minTenorMonths || tenorMonths > scheme.maxTenorMonths) {
      return res.status(400).json({
        message: `Tenor must be between ${scheme.minTenorMonths} and ${scheme.maxTenorMonths} months`,
      });
    }

    const processingFee = (finalAmount * scheme.processingFeePercent) / 100;
    const { totalInterest, totalPayable, schedule } = calculateSchedule(
      finalAmount,
      scheme.interestRate,
      tenorMonths
    );

    const loanApplication = await LoanApplication.create({
      tenantId: req.user.tenantId,
      borrowerId,
      schemeId,
      requestedAmount: finalAmount,
      tenorMonths,
      interestRate: scheme.interestRate,
      totalInterest,
      processingFee,
      totalAmountPayable: totalPayable,
      repaymentSchedule: schedule,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: loanApplication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Loan Applications for Tenant
// @route   GET /api/loans
// @access  Private
const getLoans = async (req, res) => {
  try {
    const loans = await LoanApplication.find({ tenantId: req.user.tenantId })
      .populate('borrowerId', 'name phone')
      .populate('schemeId', 'name interestRate')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: loans.length, data: loans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or Reject Loan Application
// @route   PATCH /api/loans/:id/approve
// @access  Private (ORG_ADMIN)
const approveLoan = async (req, res) => {
  try {
    const { status } = req.body;

    const loan = await LoanApplication.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    if (loan.status !== 'PENDING') {
      return res.status(400).json({ message: `Cannot modify loan that is already ${loan.status}` });
    }

    loan.status = status || 'APPROVED';
    loan.approvedBy = req.user.id;
    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Disburse Approved Loan
// @route   PATCH /api/loans/:id/disburse
// @access  Private (ORG_ADMIN)
const disburseLoan = async (req, res) => {
  try {
    const loan = await LoanApplication.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    if (loan.status !== 'APPROVED') {
      return res.status(400).json({ message: `Only APPROVED loans can be disbursed. Current status: ${loan.status}` });
    }

    loan.status = 'DISBURSED';
    loan.disbursedAt = new Date();
    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add/Verify in controllers/loanController.js
const getLoanById = async (req, res) => {
  try {
    const loan = await LoanApplication.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    })
      .populate('borrowerId')
      .populate('schemeId');

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan application not found' });
    }

    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Repay Installment
const repayInstallment = async (req, res) => {
  try {
    const { installmentNumber, paymentMode, transactionRef } = req.body;

    const loan = await LoanApplication.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    if (loan.status !== 'DISBURSED') {
      return res.status(400).json({
        message: `Repayments can only be processed for DISBURSED loans. Current status: ${loan.status}`,
      });
    }

    // Find target installment
    const installment = loan.repaymentSchedule.find(
      (item) => item.installmentNumber === Number(installmentNumber)
    );

    if (!installment) {
      return res.status(404).json({ message: `Installment #${installmentNumber} not found` });
    }

    if (installment.status === 'PAID') {
      return res.status(400).json({ message: `Installment #${installmentNumber} is already paid` });
    }

    // Update installment status
    installment.status = 'PAID';
    installment.paidAt = new Date();
    installment.paymentMode = paymentMode || 'CASH';
    installment.transactionRef = transactionRef || null;

    // Check if all installments are paid
    const allPaid = loan.repaymentSchedule.every((item) => item.status === 'PAID');
    if (allPaid) {
      loan.status = 'REPAID';
    }

    await loan.save();

    res.status(200).json({
      success: true,
      message: `Installment #${installmentNumber} payment recorded successfully`,
      data: loan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyForLoan, getLoans, getLoanById, approveLoan, disburseLoan, repayInstallment };