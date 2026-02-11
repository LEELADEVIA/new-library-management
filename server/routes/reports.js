const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// Get Recommendations (Highest rated and Most borrowed)
router.get('/recommendations', async (req, res) => {
    try {
        const highestRated = await Book.find().sort({ averageRating: -1 }).limit(5);
        const mostBorrowed = await Book.find().sort({ borrowCount: -1 }).limit(5);
        res.json({ highestRated, mostBorrowed });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Activity Reports
router.get('/activity', async (req, res) => {
    try {
        const mostBorrowed = await Book.find().sort({ borrowCount: -1 }).limit(10);
        const mostRated = await Book.find().sort({ totalRatings: -1 }).limit(10);
        res.json({ mostBorrowed, mostRated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Recently Added Books
router.get('/recent', async (req, res) => {
    try {
        const recentBooks = await Book.find().sort({ createdAt: -1 }).limit(10);
        res.json(recentBooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
