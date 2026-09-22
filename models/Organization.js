const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true }, // e.g. "apex-finance"
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    subscriptionPlan: {
      type: String,
      enum: ['FREE_TRIAL', 'BASIC', 'PRO', 'ENTERPRISE'],
      default: 'FREE_TRIAL',
    },
    subscriptionStatus: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', organizationSchema);