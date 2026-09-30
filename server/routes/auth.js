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

    // Checking if an account already exists for this email.
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Successfully created!" });
    }

    // Encrypt (Hash) the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user object
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    };

    // ✅ If the user is a teacher, create a meetingSlug.
    if (role === 'teacher') {
      // Generating a slug from a name (e.g., "Asgar Ali" → "asgar")
      const meetingSlug = name.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '');
      
      // চেক করো স্লাগটি ইউনিক কি না
      const existingTeacher = await User.findOne({ meetingSlug });
      if (existingTeacher) {
        // If it is not unique, add a random number.
        userData.meetingSlug = `${meetingSlug}${Math.floor(Math.random() * 1000)}`;
      } else {
        userData.meetingSlug = meetingSlug;
      }
    }

    // Save the user.
    user = new User(userData);
    await user.save();

    res.status(201).json({ message: "Account successfully created!" });
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).json({ message: "Server erro" });
  }
});

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "wrong email or password!" });
    }

    // Checking if the passwords match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "wrong email or password!" });
    }

    // Generating a token if the password matches.
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
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;