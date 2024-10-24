const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Ensure this path is correct
const { isAuthenticated } = require('../middlewares/authMiddleware'); // Adjust the path accordingly

// Route to fetch all orders, protected by authentication middleware
router.get('/order_history', isAuthenticated, async (req, res) => {
    try {
        const orders = await Order.find().sort({ billingDate: -1 }); // Fetch orders and sort by billing date (most recent first)
        res.render('order_history', { orders }); // Pass orders to the view
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Ensure you have other routes defined if needed...

module.exports = router;
