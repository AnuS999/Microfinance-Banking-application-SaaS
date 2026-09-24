const mongoose = require('mongoose');

const repaymentScheduleSchema = new mongoose.Schema({
  installmentNo: Number,
  dueDate: Date,
  principalComponent: Number,
  interestComponent: Number,
  totalPayment: Number,
  remainingBalance: Number,
  status: {
    type: String,
    enum: ['PENDING', 'PENDING_APPROVAL', 'PAID', 'OVERDUE'],
    default: 'PENDING',
  },
  paidAt: Date,
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
});

const loanSchema = new mongoose.Schema(
  {
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Borrower',
      required: true,
    },
    principalAmount: { type: Number, required: true },
    annualInterestRate: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    disbursementDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['DISBURSED', 'ACTIVE', 'CLOSED'],
      default: 'ACTIVE',
    },
    schedule: [repaymentScheduleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Loan', loanSchema);