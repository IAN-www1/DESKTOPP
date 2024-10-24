const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    sizes: [{ size: String, price: Number }] // Change this to handle dynamic sizes and prices
});

module.exports = mongoose.model('Item', itemSchema);