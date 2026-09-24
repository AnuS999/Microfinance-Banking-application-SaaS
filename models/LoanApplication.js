const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema({
  installmentNumber: Number,
  dueDate: Date,
  principalComponent: Number,
  interestComponent: Number,
  totalInstallmentAmount: Number,
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'OVERDUE'],
    default: 'PENDING',
  },
  paidAt: Date,
  paymentMode: String,
  transactionRef: String,
});

const loanApplicationSchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      ref: 'Organization',
      required: true,
      default: 'DEFAULT',
      index: true,
    },
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Borrower',
      required: true,
    },
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoanScheme',
      required: false, // General/Custom loans ke liye optional
      default: null,
    },
    requestedAmount: {
      type: Number,
      required: [true, 'Please specify requested amount'],
    },
    tenorMonths: {
      type: Number,
      required: [true, 'Please enter loan tenor in months'],
    },
    interestRate: {
      type: Number,
      required: true,
    },
    totalInterest: {
      type: Number,
      default: 0,
    },
    processingFee: {
      type: Number,
      default: 0,
    },
    totalAmountPayable: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'DISBURSED', 'REPAID', 'CLOSED'],
      default: 'PENDING',
    },
    repaymentSchedule: [repaymentSchema],
    createdBy: {
      type: String, // String representation for fallback stability
      required: true,
      default: '6ab2c9aab69cd8a5cedf3a59',
    },
    approvedBy: {
      type: String,
      default: null,
    },
    disbursedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);