const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Production me bcrypt se hash karein
  role: { type: String, enum: ['Admin', 'Agent'], required: true },
  designation: { type: String, required: true },
  salary: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);