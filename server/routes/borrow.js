const express = require('express');
const BorrowHistory = require('../models/BorrowHistory');
const Book = require('../models/Book');
const Rating = require('../models/Rating');
const router = express.Router();
const auth = require('../middleware/auth');

// Borrow a book
router.post('/', auth, async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;

        const borrow = new BorrowHistory({ userId, bookId });
        await borrow.save();

        await Book.findByIdAndUpdate(bookId, { $inc: { borrowCount: 1 } });

        res.status(201).json({ message: 'Book borrowed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rate a book
router.post('/rate', auth, async (req, res) => {
    try {
        const { bookId, rating } = req.body;
        const userId = req.user.id;

        const newRating = new Rating({ userId, bookId, rating });
        await newRating.save();

        // Update average rating
        const book = await Book.findById(bookId);
        const totalRatingSum = (book.averageRating * book.totalRatings) + rating;
        const newTotalRatings = book.totalRatings + 1;
        const newAverageRating = totalRatingSum / newTotalRatings;

        await Book.findByIdAndUpdate(bookId, {
            averageRating: newAverageRating,
            totalRatings: newTotalRatings
        });

        res.status(201).json({ message: 'Rating submitted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
