const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Assuming you have a Mongoose model named Item
const authenticateToken = require('../middleware/authMiddleware');

// Route to get the menu page
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.render('menu', { items });
    } catch (err) {
        req.flash('error_msg', 'Error fetching items');
        res.redirect('/');
    }
});
// Protect this route with authentication
router.get('/protected-route', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

// Public route (no authentication required)
router.get('/public-route', (req, res) => {
    res.send('This is a public route');
});
module.exports = router;
