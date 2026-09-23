const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
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
      required: true,
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
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'DISBURSED', 'CLOSED'],
      default: 'PENDING',
    },
    repaymentSchedule: [
      {
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
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    disbursedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);