const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    orderID: {
        type: String,
        required: true,
        unique: true
    },
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    addOns: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    paymentMethod: {
        type: String,
        enum: ['cash', 'paymaya', 'gcash'],
        required: true
    },
    serviceType: {
        type: String,
        enum: ['pickup', 'dine-in'],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Sales', salesSchema);
