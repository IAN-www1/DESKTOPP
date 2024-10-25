const express = require('express');
const router = express.Router();
const { handleLogin } = require('../controllers/loginController'); // Adjust the path as necessary

// Route to serve login page
router.get('/login', (req, res) => {
    // Check if the user is already logged in
    if (req.session.userId) {
        return res.redirect('/dashboard'); // Redirect to dashboard if already logged in
    }
    res.render('login'); // Render login page if not logged in
});

// Handle login form submission
router.post('/login', handleLogin);


module.exports = router;
