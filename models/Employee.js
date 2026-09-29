const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeCode: { type: String, required: true, unique: true, sparse: true, trim: true },
  name: { type: String, required: true },
  fullName: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Agent', 'Manager'], default: 'Agent' },
  designation: { type: String, default: 'Field Officer' },
  phoneNumber: { type: String },
  salary: { type: Number, default: 0 },
  joiningDate: { type: Date },
  address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);