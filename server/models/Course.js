const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // teacher details
  thumbnail: String,
  lessons: [
    {
      title: String,
      videoUrl: String,
      textContent: String,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);