const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication', required: true },
  memberName: { type: String, required: true },
  branchName: { type: String, required: true },
  installmentNo: { type: Number, required: true }, // Jaise Week 1, Week 2 ... Week 50
  emiAmount: { type: Number, required: true },
  collectionDate: { type: Date, default: Date.now },
  collectedBy: { type: String, required: true }, // Agent Name
  paymentMode: { type: String, enum: ['CASH', 'ONLINE', 'UPI'], default: 'CASH' },
  status: { type: String, enum: ['PAID', 'PENDING', 'BOUNCED'], default: 'PAID' }
}, { timestamps: true });

module.exports = mongoose.model('Repayment', repaymentSchema);