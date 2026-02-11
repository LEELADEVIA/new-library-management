const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        const user = new User({ username, password, email });
        await user.save();
        res.status(201).json({ message: 'Registration successful! You can now log in.' });
    } catch (err) {
        console.error('Registration error:', err);
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(409).json({ error: `${field} already exists` });
        }
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token, userId: user._id, username: user.username, email: user.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
