const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // 2 people can't create account with same email
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['student', 'teacher'], // only 2 types of user
    default: 'student' 
  },
}, { timestamps: true }); // save account creation date

module.exports = mongoose.model('User', userSchema);