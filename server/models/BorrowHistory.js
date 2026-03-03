const mongoose = require('mongoose');

const borrowHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, default: function() {
        const due = new Date();
        due.setDate(due.getDate() + 10);
        return due;
    }},
    returned: { type: Boolean, default: false },
    returnDate: { type: Date, default: null }
});

module.exports = mongoose.model('BorrowHistory', borrowHistorySchema);
