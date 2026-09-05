const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  completedLessons: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Lesson' 
    }
  ],
  lastWatchedLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }
}, { timestamps: true });

// a user can enter 1 course at a time
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);