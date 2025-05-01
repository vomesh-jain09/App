const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,  // Ab String nahi, Number
    unique: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  cover: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
