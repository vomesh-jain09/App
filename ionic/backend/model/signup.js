const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email must be unique
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum length for password
  }
});
module.exports = mongoose.model('User', userSchema);