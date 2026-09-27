const mongoose = require('mongoose');

const masterDropdownSchema = new mongoose.Schema({
  category: { type: String, required: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('MasterDropdown', masterDropdownSchema);