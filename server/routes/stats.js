const express = require('express');
const Book = require('../models/Book');
const BorrowHistory = require('../models/BorrowHistory');
const router = express.Router();
const auth = require('../middleware/auth');

// Get generic and user-specific stats
router.get('/', auth, async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const categories = await Book.distinct('category');
        const userBorrowed = await BorrowHistory.countDocuments({ userId: req.user.id });
        const highRatedCount = await Book.countDocuments({ averageRating: { $gte: 4 } });

        res.json({
            totalBooks,
            totalCategories: categories.length,
            userBorrowed,
            recommendedCount: highRatedCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
