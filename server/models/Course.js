const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  thumbnail: String,
  meetingLink: String, // ✅ new field
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lessons: [
    {
      title: String,
      videoUrl: String,
      textContent: String,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);