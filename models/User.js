const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Use bcryptjs for compatibility

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Only hash if the password is modified
  const salt = await bcrypt.genSalt(10); // Generate a salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password); // Compare plain text password with hashed password
};

module.exports = mongoose.model('User', userSchema);
