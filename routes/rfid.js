const express = require('express');
const bcrypt = require('bcryptjs'); // Using bcrypt.js
const router = express.Router();
const RFID_Users = require('../models/RFID_Users'); // Correct relative path to your model
const { isAuthenticated } = require('../middlewares/authMiddleware'); // Ensure the path to your middleware is correct

// Render the registration form
router.get('/register', isAuthenticated, (req, res) => {
  // Display any flash messages
  const messages = req.flash('error');
  const successMessages = req.flash('success'); // Add success messages
  res.render('rfid_register', { messages, successMessages }); // Pass messages to the view
});

// Handle form submission
router.post('/register', isAuthenticated, async (req, res) => {
  const { username, password, confirmPassword, name, contact, rfidTagId } = req.body;

  // Validate passwords match
  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/rfid/register'); // Redirect back to the registration page
  }

  try {
    // Check if username already exists
    const existingUser = await RFID_Users.findOne({ username });
    if (existingUser) {
      req.flash('error', 'Username is already taken');
      return res.redirect('/rfid/register'); // Redirect back to the registration page
    }

    // Check if RFID Tag ID already exists
    const existingRFID = await RFID_Users.findOne({ rfidTagId });
    if (existingRFID) {
      req.flash('error', 'RFID Tag ID is already taken');
      return res.redirect('/rfid/register'); // Redirect back to the registration page
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new RFID user
    const newUser = new RFID_Users({
      username,
      password: hashedPassword, // Store hashed password
      name,
      contact,
      rfidTagId,
      balance: 0 // Initial balance is 0
    });

    // Save the user to the database
    await newUser.save();
    
    req.flash('success', 'RFID user registered successfully!'); // Add success message
    res.redirect('/rfid/register'); // Redirect to the registration page to display messages
  } catch (err) {
    req.flash('error', 'Error registering RFID user: ' + err);
    res.redirect('/rfid/register'); // Redirect back to the registration page
  }
});

module.exports = router; // Export the router
