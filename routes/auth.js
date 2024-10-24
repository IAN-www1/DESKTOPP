const express = require('express');
const router = express.Router();
const { handleLogin } = require('../controllers/loginController');

router.post('/logout', (req, res) => {
    // Perform logout logic here (e.g., destroying the session)
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Logout failed');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.sendStatus(200); // Send success status
    });
});
router.get('/check-auth', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});
// Render login page with flash messages
router.get('/login', (req, res) => {
    res.render('login', { 
      messages: {
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      }
    });
  });
  
  // Handle login submission
  router.post('/login', handleLogin);
  
module.exports = router;
