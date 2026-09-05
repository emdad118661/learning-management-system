const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


//auth route
app.use('/api/auth', require('./routes/auth'));

// upload routes
app.use('/api/upload', require('./routes/uploadRoutes'));

// progress route
app.use('/api/progress', require('./routes/progressRoutes'));

 // clender route
app.use('/api/calendar', require('./routes/calendarRoutes'));

// Course routes
app.use('/api/courses', require('./routes/courseRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.send("LMS Server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});