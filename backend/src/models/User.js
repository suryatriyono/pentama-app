const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: 'student',
    enum: ['admin', 'lecturer', 'student'],
  },
  isActive: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

// Hash password before saving
UserSchema.pre('save', async (next) => {
  if (this.isModified()) this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
UserSchema.method.comparePassword = async (password) => {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
