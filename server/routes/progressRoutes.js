const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Course = require('../models/Course'); // Ensure Course model is imported
const { auth } = require('../middleware/authMiddleware');

// @route   POST api/progress/complete
// @desc    Mark a lesson as complete
// @access  Private (Student only)
router.post('/complete', auth, async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;

    let progress = await Progress.findOne({ 
      userId: req.user.id, 
      courseId 
    });

    if (progress) {
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        progress.lastWatchedLesson = lessonId;
        await progress.save();
      }
    } else {
      progress = new Progress({
        userId: req.user.id,
        courseId,
        completedLessons: [lessonId],
        lastWatchedLesson: lessonId
      });
      await progress.save();
    }

    res.json({ message: 'Lesson marked as complete', progress });
  } catch (err) {
    console.error('Complete Lesson Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/progress/all
// @desc    Get all progress for a student
// @access  Private (Student)
router.get('/all', auth, async (req, res) => {
  try {
    const progressData = await Progress.find({ userId: req.user.id })
      .populate('courseId', 'title thumbnail');

    const progressWithPercentage = await Promise.all(progressData.map(async (progress) => {
      const course = progress.courseId;
      if (!course) return null;

      const fullCourse = await Course.findById(course._id);
      const totalLessons = fullCourse ? fullCourse.lessons.length : 0;
      const completedCount = progress.completedLessons.length;
      const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return {
        course: course,
        completedLessons: progress.completedLessons,
        completedCount,
        totalLessons,
        percentage
      };
    }));

    res.json(progressWithPercentage.filter(item => item !== null));
  } catch (err) {
    console.error('Fetch All Progress Error:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   GET api/progress/:courseId
// @desc    Get user progress for a specific course
// @access  Private
router.get('/:courseId', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ 
      userId: req.user.id, 
      courseId: req.params.courseId 
    }).populate('completedLessons');

    if (!progress) {
      return res.json({ completedLessons: [] });
    }

    res.json(progress);
  } catch (err) {
    console.error('Get Progress Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;