const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  borrowerId: { type: String, required: true },
  borrowerName: { type: String, required: true },
  loanId: { type: String, required: true },
  centerName: { type: String, required: true },
  dueAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  paymentMode: { type: String, enum: ['Cash', 'Online'], default: 'Cash' },
  collectionDate: { type: Date, default: Date.now },
  collectedBy: { type: String } // Agent or Admin name
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);