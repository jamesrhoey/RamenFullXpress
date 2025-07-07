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
    default: Date.now
  }
});

module.exports = mongoose.model('Inventory', inventorySchema); 