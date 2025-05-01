const User = require('../model/signup'); 
const bcrypt = require('bcryptjs');


exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
  
    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
  
    // Check if the email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'Email is already registered' });
    }
  
    // Create a new user
    const newUser = new User({
      name,
      email,
      password,
    });
  
    try {
      // Save the user to the database
      const user = await newUser.save();
      res.status(201).json({
        msg: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      res.status(500).json({ msg: 'Server Error', error: err.message });
    }
  }
  // Login controller
  exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter both email and password' });
    }
  
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
  
    // Compare the provided password with the stored password directly (plain text)
    if (password !== user.password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
  
    // Send the success response
    res.status(200).json({
      msg: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  };
  