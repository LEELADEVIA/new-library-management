const express = require('express');
const Book = require('../models/Book');
const router = express.Router();
const auth = require('../middleware/auth');

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Book.distinct('category');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Search books by title, author, or category
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.json([]);
        }

        // Create a regex for "starts with" (case-insensitive)
        const searchRegex = new RegExp('^' + query, 'i');

        const books = await Book.find({
            $or: [
                { title: searchRegex },
                { author: searchRegex },
                { category: searchRegex }
            ]
        });
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get books by category
router.get('/category/:category', async (req, res) => {
    try {
        const books = await Book.find({ category: req.params.category });
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
