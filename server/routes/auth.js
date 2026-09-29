const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // চেক করা হচ্ছে এই ইমেইলে আগে থেকেই কোনো অ্যাকাউন্ট আছে কি না
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "এই ইমেইল দিয়ে আগে থেকেই অ্যাকাউন্ট আছে!" });
    }

    // পাসওয়ার্ড এনক্রিপ্ট (Hash) করা
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // নতুন ইউজার অবজেক্ট তৈরি
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    };

    // ✅ Teacher হলে meetingSlug তৈরি করো
    if (role === 'teacher') {
      // নাম থেকে স্লাগ তৈরি (যেমন: "Asgar Ali" → "asgar")
      const meetingSlug = name.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '');
      
      // চেক করো স্লাগটি ইউনিক কি না
      const existingTeacher = await User.findOne({ meetingSlug });
      if (existingTeacher) {
        // যদি ইউনিক না হয়, তবে র্যান্ডম নম্বর যুক্ত করো
        userData.meetingSlug = `${meetingSlug}${Math.floor(Math.random() * 1000)}`;
      } else {
        userData.meetingSlug = meetingSlug;
      }
    }

    // ইউজার সেভ করো
    user = new User(userData);
    await user.save();

    res.status(201).json({ message: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!" });
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).json({ message: "সার্ভার এরর" });
  }
});

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ইউজার আছে কি না চেক করা
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "ভুল ইমেইল বা পাসওয়ার্ড!" });
    }

    // পাসওয়ার্ড মিলছে কি না চেক করা
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "ভুল ইমেইল বা পাসওয়ার্ড!" });
    }

    // পাসওয়ার্ড মিলে গেলে একটি Token তৈরি করে দেওয়া
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            name: user.name, 
            role: user.role,
            meetingSlug: user.meetingSlug 
          } 
        });
      }
    );
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: "সার্ভার এরর" });
  }
});

module.exports = router;