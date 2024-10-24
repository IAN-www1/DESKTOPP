const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Assuming you have a Mongoose model named Item

// Route to get the items page
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.render('items', { items, success_msg: req.flash('success_msg'), error_msg: req.flash('error_msg') });
    } catch (err) {
        req.flash('error_msg', 'Error fetching items');
        res.redirect('/');
    }
});

// Route to add an item
router.post('/add', async (req, res) => {
    const { name, category, image, price, description, noSizeNeeded, sizes } = req.body;

    // Check if the "noSizeNeeded" option is checked
    let sizesArray = [];
    if (!noSizeNeeded) {
        // If sizes are provided, ensure sizes is an array of objects with size and price
        sizesArray = Array.isArray(sizes) ? sizes : [];
    }

    const newItem = new Item({
        name,
        category,
        image,
        price,
        description,
        sizes: sizesArray
    });

    try {
        await newItem.save();
        req.flash('success_msg', 'Item added successfully');
        res.json({ success: true });
    } catch (err) {
        console.error('Error adding item:', error.message);
        res.redirect('/items?error_msg=' + encodeURIComponent(error.message));
    }
});


// Route to edit an item
router.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, image, price, description, sizes } = req.body;

    // Ensure sizes is an array
    const sizesArray = Array.isArray(sizes) ? sizes : [];

    try {
        // Find the item by ID and update it with the new values
        const updatedItem = await Item.findByIdAndUpdate(id, {
            name,
            category,
            image,
            price,
            description,
            sizes: sizesArray
        }, { new: true }); // `new: true` returns the updated document

        if (!updatedItem) {
            req.flash('error_msg', 'Item not found');
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        req.flash('success_msg', 'Item updated successfully');
        res.json({ success: true, item: updatedItem });
    } catch (err) {
        req.flash('error_msg', 'Error updating item');
        res.status(500).json({ success: false, message: 'Error updating item' });
    }
});

// Route to delete an item
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Item.findByIdAndDelete(id);
        req.flash('success_msg', 'Item deleted successfully');
        res.json({ success: true });
    } catch (err) {
        req.flash('error_msg', 'Error deleting item');
        res.status(500).json({ success: false, message: 'Error deleting item' });
    }
});

module.exports = router;
