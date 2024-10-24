const express = require('express');
const router = express.Router();
const RFID_Users = require('../models/RFID_Users');

// POST route to fetch user by RFID
router.post('/fetch-user', async (req, res) => {
    const { rfid } = req.body;
    console.log('Received RFID:', rfid); // Log the received RFID

    // Define the expected length of the RFID
    const expectedRFIDLength = 10; // Change this value as per your RFID length requirement

    // Check if the RFID length is valid
    if (rfid.length !== expectedRFIDLength) {
        return res.status(400).json({ message: `Invalid RFID length. Expected ${expectedRFIDLength} digits.` });
    }

    try {
        const user = await RFID_Users.findOne({ rfidTagId: rfid });
        console.log('Fetched User:', user); // Log the fetched user
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user); // Return user with balance
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
});

// POST route to update user balance
router.post('/update-balance', async (req, res) => {
    const { rfid, newBalance } = req.body;
    
    try {
        // Update the user's balance in the database
        const updatedUser = await RFID_Users.findOneAndUpdate(
            { rfidTagId: rfid },
            { balance: newBalance },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ message: 'Balance updated successfully!', updatedUser });
    } catch (error) {
        console.error('Error updating balance:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
