const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    borrowCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
