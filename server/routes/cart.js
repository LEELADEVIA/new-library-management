const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();
const auth = require('../middleware/auth');

// Add book to cart
router.post('/', auth, async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;

        // Prevent duplicates
        const existingItem = await Cart.findOne({ userId, bookId });
        if (existingItem) {
            return res.status(400).json({ message: 'Book already in cart' });
        }

        const cartItem = new Cart({ userId, bookId });
        await cartItem.save();
        res.status(201).json(cartItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user cart
router.get('/', auth, async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.user.id }).populate('bookId');
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove from cart
router.delete('/:bookId', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId } = req.params;
        await Cart.findOneAndDelete({ userId, bookId });
        res.json({ message: 'Removed from cart' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
