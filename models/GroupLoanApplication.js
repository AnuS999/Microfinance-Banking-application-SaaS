const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  kycDocuments: {
    aadhaarNumber: { type: String, required: true },
    panNumber: { type: String, required: true },
    voterIdNumber: { type: String, required: true },
  },
  cibilScore: { type: Number, default: null },
  status: {
    type: String,
    enum: ['PENDING_CIBIL', 'APPROVED', 'REJECTED'],
    default: 'PENDING_CIBIL',
  },
});

const groupLoanApplicationSchema = new mongoose.Schema(
  {
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    centerNameOrLocation: { type: String, required: true },
    members: [memberSchema],
    groupStatus: {
      type: String,
      enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED'],
      default: 'PENDING_APPROVAL',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GroupLoanApplication', groupLoanApplicationSchema);