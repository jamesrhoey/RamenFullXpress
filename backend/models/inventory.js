const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  stocks: {
    type: Number,
    required: true
  },
  units: {
    type: String,
    required: true
  },
  restocked: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['in stock', 'low stock', 'out of stock'],
    required: true
  }
});

module.exports = mongoose.model('Inventory', inventorySchema); 