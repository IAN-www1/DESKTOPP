// routes/checkout.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Route to handle checkout
router.post('/', async (req, res) => {
    try {
        const { customerName, customerContact, billingDate, totalAmount, paymentMethod, paymentDetails } = req.body;

        // Create a new order document
        const newOrder = new Order({
            customerName,
            customerContact,
            billingDate,
            totalAmount,
            paymentMethod,
            paymentDetails
        });

        // Save the order to the database
        await newOrder.save();

        // Respond with success message
        res.status(200).json({ message: 'Order saved successfully!' });
    } catch (error) {
        console.error('Error saving order:', error); // Log the complete error
        res.status(500).json({ message: 'Failed to save order.', error: error.message }); // Include the error message
    }
});


module.exports = router;
