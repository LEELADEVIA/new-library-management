const express = require('express');
const Book = require('../models/Book');
const BorrowHistory = require('../models/BorrowHistory');
const router = express.Router();
const auth = require('../middleware/auth');

// Auto-restock: Return overdue books (past 10 days)
const autoRestockOverdueBooks = async () => {
    try {
        const now = new Date();
        const overdueBooks = await BorrowHistory.find({
            returned: false,
            dueDate: { $lte: now }
        });

        for (const record of overdueBooks) {
            record.returned = true;
            record.returnDate = now;
            await record.save();

            await Book.findByIdAndUpdate(record.bookId, {
                $inc: { availableCount: 1 }
            });
        }
    } catch (err) {
        console.error('Auto-restock error:', err.message);
    }
};

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
        // Auto-restock overdue books first
        await autoRestockOverdueBooks();

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
        // Auto-restock overdue books first
        await autoRestockOverdueBooks();

        const books = await Book.find({ category: req.params.category });
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
