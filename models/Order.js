const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    customerContact: {
        type: String,
        required: true
    },
    billingDate: {
        type: Date,
        default: Date.now
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentDetails: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
