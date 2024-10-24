const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String }, // Customer's name
  contact: { type: String }, // Customer's contact number

  // RFID-specific fields
  rfidTagId: { type: String, required: true, unique: true, select: true }, // Exclude from queries
    balance: { type: Number, default: 0, select: true }, // Exclude from queries
  
  // For password reset functionality (if needed)
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

module.exports = mongoose.model('RFID_Users', customerSchema);
