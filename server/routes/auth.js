const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // our own user model path

// 1. Registration Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check whether the email is already exists or not
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "this email already exists" });
    }

    // encrypt the password (Hash)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create and save new user in database
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student' // if there's nothing, by default'student'
    });
    await user.save();

    res.status(201).json({ message: "account has been created successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// 2. Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "wrong email or password" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "wrong email or password" });
    }

    // token will be created if password matches
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // secret key in .env file
      { expiresIn: '7d' }, // will work for 7 days
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;