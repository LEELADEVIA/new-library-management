const mongoose = require('mongoose');

const borrowHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BorrowHistory', borrowHistorySchema);
