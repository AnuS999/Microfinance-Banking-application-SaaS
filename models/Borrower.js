const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please add borrower name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add phone number'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    aadhaarNumber: {
      type: String,
      required: [true, 'Please add Aadhaar number'],
      trim: true,
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    occupation: {
      type: String,
      trim: true,
    },
    monthlyIncome: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure phone or Aadhaar is unique WITHIN a single tenant
borrowerSchema.index({ tenantId: 1, phone: 1 });
borrowerSchema.index({ tenantId: 1, aadhaarNumber: 1 });

module.exports = mongoose.model('Borrower', borrowerSchema);