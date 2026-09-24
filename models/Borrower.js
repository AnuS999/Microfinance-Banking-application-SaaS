const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    aadhaarNumber: {
      type: String,
      required: [true, 'Aadhaar number is required'],
      unique: true,
      trim: true,
    },
    panNumber: {
      type: String,
      required: [true, 'PAN number is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DEFTERD'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Borrower', borrowerSchema);