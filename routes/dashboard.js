const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path as necessary
const Order = require('../models/Order'); // Adjust path as necessary
const Item = require('../models/Item'); // Adjust path as necessary
const { isAuthenticated, redirectIfAuthenticated } = require('../middlewares/authMiddleware');

// Dashboard route
router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            req.flash('error_msg', 'User not found');
            return res.redirect('/login');
        }

        // Calculate today's date and fetch statistics (as before)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999); // End of today

        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: today, $lte: endOfToday }
        });

        const itemsCount = await Item.countDocuments();
        const totalOrders = await Order.countDocuments();

        const todaySalesResult = await Order.aggregate([
            { $match: { createdAt: { $gte: today, $lte: endOfToday } } },
            { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
        ]);

        const todaySales = todaySalesResult.length > 0 ? todaySalesResult[0].totalSales : 0;

        const totalSalesResult = await Order.aggregate([
            { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
        ]);

        const totalSales = totalSalesResult.length > 0 ? totalSalesResult[0].totalSales : 0;

        res.render('dashboard', { user, itemsCount, totalOrders, todayOrders, todaySales, totalSales });
    } catch (error) {
        console.error('Error fetching user:', error);
        req.flash('error_msg', 'An error occurred while fetching user information');
        res.redirect('/login');
    }
});

// Prevent access to login page if logged in
router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('login'); // Render login page if not authenticated
});

module.exports = router;
