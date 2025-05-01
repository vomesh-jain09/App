const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅ Import cors here
const router = require('./Router/Route'); // Assuming this file exists
require('dotenv').config();
const app = express();
const PORT = process.env.PORT

// Middleware to parse JSON requests
app.use(express.json());

// ✅ Enable CORS
app.use(cors());


app.use('/', router);


mongoose.connect(process.env.MONGOURL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB:', err.message);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
