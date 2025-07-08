const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    cashier: { type: String },
    notes: { type: String }
});

module.exports = mongoose.model('Sales', salesSchema);
