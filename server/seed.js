const mongoose = require('mongoose');
const Book = require('./models/Book');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-library';

const books = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', borrowCount: 10, averageRating: 4.5, totalRatings: 2 },
    { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', category: 'Story Books', borrowCount: 25, averageRating: 4.9, totalRatings: 10 },
    { title: 'Steve Jobs', author: 'Walter Isaacson', category: 'Biography Books', borrowCount: 15, averageRating: 4.8, totalRatings: 5 },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Education Book', borrowCount: 5, averageRating: 4.6, totalRatings: 3 },
    { title: 'Atomic Habits', author: 'James Clear', category: 'Popular Book', borrowCount: 30, averageRating: 4.9, totalRatings: 15 },
    { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Non Fiction', borrowCount: 8, averageRating: 4.6, totalRatings: 2 },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', borrowCount: 12, averageRating: 4.7, totalRatings: 4 },
    { title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', category: 'Biography Books', borrowCount: 20, averageRating: 4.9, totalRatings: 8 },
    { title: 'Physics for Scientists', author: 'Serway', category: 'Education Book', borrowCount: 7, averageRating: 4.4, totalRatings: 3 },
    { title: 'The Alchemist', author: 'Paulo Coelho', category: 'Story Books', borrowCount: 18, averageRating: 4.5, totalRatings: 6 },
    { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', category: 'Popular Book', borrowCount: 28, averageRating: 4.8, totalRatings: 12 },
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Non Fiction', borrowCount: 9, averageRating: 4.5, totalRatings: 3 }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        await Book.deleteMany({});
        await Book.insertMany(books);
        console.log('Database seeded successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
