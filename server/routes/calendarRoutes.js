const express = require('express');
const router = express.Router();
const CalendarEvent = require('../models/CalendarEvent');
const { auth, checkRole } = require('../middleware/authMiddleware');

// @route   POST api/calendar
// @desc    Create calendar event (Teacher only)
// @access  Private (Teacher)
router.post('/', auth, checkRole('teacher'), async (req, res) => {
  try {
    const { courseId, title, description, eventDate } = req.body;

    if (!title || !eventDate) {
      return res.status(400).json({ message: 'Title and eventDate are required' });
    }

    // Set to `undefined` if `courseId` is empty (it will not be saved in MongoDB).
    const eventData = {
      teacherId: req.user.id,
      title,
      description,
      eventDate: new Date(eventDate)
    };

    // Add the courseId only if it is valid.
    if (courseId && courseId.trim() !== '') {
      eventData.courseId = courseId;
    }

    const newEvent = new CalendarEvent(eventData);
    const event = await newEvent.save();
    
    res.json(event);
  } catch (err) {
    console.error('Calendar Event Error:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   GET api/calendar
// @desc    Get all events (Read-only for students)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await CalendarEvent.find().populate('teacherId', 'name email');
    res.json(events);
  } catch (err) {
    console.error('Fetch Events Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE api/calendar/:id
// @desc    Delete calendar event
// @access  Private (Teacher only - own event)
router.delete('/:id', auth, checkRole('teacher'), async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the teacher created this event themselves.
    if (event.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await CalendarEvent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete Event Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;