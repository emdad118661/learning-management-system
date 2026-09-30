const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
  meetingSlug: { type: String, unique: true, sparse: true }, // ✅ uniq meeting slug
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);