const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  },
  title: { type: String, required: true },
  description: String,
  eventDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);