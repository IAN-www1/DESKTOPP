const express = require('express');
const router = express.Router();
const Customer = require('../models/RFID_Users'); // Assuming you have a Customer model
const User = require('../models/User'); // Assuming you have a User model for admin authentication
const bcrypt = require('bcryptjs'); // Using bcryptjs for password hashing
const { isAuthenticated } = require('../middlewares/authMiddleware'); // Ensure the path to your middleware is correct

// Route for rendering the top-up page
router.get('/topup', isAuthenticated, (req, res) => {
  // Get success message from query parameters
  const successMessages = req.query.success ? [req.query.success] : [];
  res.render('topup', { message: null, successMessages });
});

// Route to handle top-up submission
router.post('/topup', isAuthenticated, async (req, res) => {
  const { rfidTagId, topUpAmount, adminEmail, adminPassword } = req.body;

  try {
    // Validate admin credentials
    const admin = await User.findOne({ email: adminEmail });
    if (!admin || !(await bcrypt.compare(adminPassword, admin.password))) {
      return res.render('topup', { 
        message: 'Invalid admin credentials. Top-up failed.', 
        successMessages: [] 
      });
    }

    // Find the customer by RFID tag ID
    const customer = await Customer.findOne({ rfidTagId });

    if (customer) {
      // Top up the balance
      customer.balance += parseFloat(topUpAmount);
      await customer.save();

      // Redirect to the top-up page with a success message
      res.redirect(`/topup?success=Successfully topped up ₱${topUpAmount}`);
    } else {
      // RFID tag not found
      res.render('topup', { 
        message: 'RFID card not found. Please check your card ID.', 
        successMessages: [] 
      });
    }
  } catch (error) {
    console.error(error);
    res.render('topup', { 
      message: 'An error occurred during the top-up process. Please try again.', 
      successMessages: [] 
    });
  }
});

module.exports = router; // Export the router
