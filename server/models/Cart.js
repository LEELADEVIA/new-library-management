const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
