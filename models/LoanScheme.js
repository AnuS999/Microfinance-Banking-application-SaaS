const mongoose = require('mongoose');

const loanSchemeSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please add scheme name'],
      trim: true,
    },
    minAmount: {
      type: Number,
      required: [true, 'Please specify minimum loan amount'],
    },
    maxAmount: {
      type: Number,
      required: [true, 'Please specify maximum loan amount'],
    },
    interestRate: {
      type: Number, // Percentage per annum
      required: [true, 'Please specify interest rate'],
    },
    interestType: {
      type: String,
      enum: ['FLAT', 'REDUCING'],
      default: 'FLAT',
    },
    repaymentFrequency: {
      type: String,
      enum: ['WEEKLY', 'MONTHLY'],
      default: 'MONTHLY',
    },
    minTenorMonths: {
      type: Number,
      required: true,
    },
    maxTenorMonths: {
      type: Number,
      required: true,
    },
    processingFeePercent: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

loanSchemeSchema.index({ tenantId: 1, name: 1 });

module.exports = mongoose.model('LoanScheme', loanSchemeSchema);