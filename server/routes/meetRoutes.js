const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');

// @route   GET api/meet/:teacherSlug
// @desc    Get teacher's meeting link
// @access  Public
router.get('/:teacherSlug', async (req, res) => {
  try {
    const teacher = await User.findOne({ 
      meetingSlug: req.params.teacherSlug,
      role: 'teacher'
    }).select('name email meetingSlug');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // টিচারের সব কোর্স বের করো যেখানে meetingLink আছে
    const courses = await Course.find({ 
      teacherId: teacher._id,
      meetingLink: { $exists: true, $ne: null }
    }).select('title meetingLink');

    res.json({
      teacher,
      courses
    });
  } catch (err) {
    console.error('Meet Route Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;