const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth, checkRole } = require('../middleware/authMiddleware');

// @route   POST api/courses
// @desc    Create a new course
// @access  Private (Teacher only)
router.post('/', auth, checkRole('teacher'), async (req, res) => {
  try {
    // POST /api/courses এর ভেতরে
    const { title, description, thumbnail, meetingLink, lessons } = req.body;

    const newCourse = new Course({
      title,
      description,
      thumbnail,
      meetingLink, // ✅ newly added
      teacherId: req.user.id,
      lessons
    });

    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('teacherId', 'name email');
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/courses/:id
// @desc    Get single course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacherId', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/courses/:id
// @desc    Update a course
// @access  Private (Teacher only - own course)
router.put('/:id', auth, checkRole('teacher'), async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if teacher owns this course
    if (course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const { title, description, thumbnail, lessons } = req.body;

    course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, thumbnail, lessons },
      { new: true }
    );

    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/courses/:id
// @desc    Delete a course
// @access  Private (Teacher only - own course)
router.delete('/:id', auth, checkRole('teacher'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if teacher owns this course
    if (course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;