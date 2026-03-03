import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon, BookOpen, User, Star, Loader2, BookX, Package, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Search = () => {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [activeModal, setActiveModal] = useState(null); // 'rate' | 'borrow' | 'success' | 'error' | null
    const [selectedBook, setSelectedBook] = useState(null);
    const [ratingValue, setRatingValue] = useState(5);
    const [recommendValue, setRecommendValue] = useState('yes'); // 'yes' | 'no'
    
    // Success/Error Modal State
    const [successMessage, setSuccessMessage] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Fetch books based on query
    const fetchBooks = useCallback(async (searchTerm) => {
        if (!searchTerm.trim()) {
            setBooks([]);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(`/api/books/search?query=${searchTerm}`);
            setBooks(res.data);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch from URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        const title = params.get('title');

        if (category) {
            const fetchByCategory = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`/api/books/category/${category}`);
                    setBooks(res.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchByCategory();
            setQuery(category); // Show category in search bar
        } else if (title) {
            fetchBooks(title);
            setQuery(title);
        }
    }, [location.search, fetchBooks]);

    // Debounced search logic
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('category') === query) return;

        const timer = setTimeout(() => {
            if (query) {
                fetchBooks(query);
            } else {
                setBooks([]);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query, fetchBooks, location.search]);

    // Open Rate Modal
    const openRateModal = (book) => {
        setSelectedBook(book);
        setRatingValue(5);
        setActiveModal('rate');
    };

    // Open Borrow Modal
    const openBorrowModal = (book) => {
        setSelectedBook(book);
        setRecommendValue('yes');
        setRatingValue(5);
        setActiveModal('borrow');
    };

    const closeModals = () => {
        setActiveModal(null);
        setSelectedBook(null);
    };

    // Submit Rate
    const submitRate = async () => {
        if (!selectedBook) return;
        try {
            await axios.post('/api/borrow/rate', {
                bookId: selectedBook._id,
                rating: ratingValue
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setSuccessMessage('Thank you for your rating!');
            setDueDate('');
            setActiveModal('success');
            fetchBooks(query);
        } catch (err) {
            console.error(err);
            setErrorMessage('Error submitting rating.');
            setActiveModal('error');
        }
    };

    // Submit Borrow
    const submitBorrow = async () => {
        if (!selectedBook) return;
        if (selectedBook.availableCount <= 0) {
            setErrorMessage('This book is currently not available for borrowing.');
            setActiveModal('error');
            return;
        }
        try {
            // 1. Borrow
            const borrowRes = await axios.post('/api/borrow', { bookId: selectedBook._id }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            const borrowDueDate = new Date(borrowRes.data.dueDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // 2. Rate if recommended
            if (recommendValue === 'yes') {
                await axios.post('/api/borrow/rate', {
                    bookId: selectedBook._id,
                    rating: ratingValue
                }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setSuccessMessage(`"${selectedBook.title}" borrowed and rated successfully!`);
            } else {
                setSuccessMessage(`"${selectedBook.title}" borrowed successfully!`);
            }

            setDueDate(borrowDueDate);
            setActiveModal('success');
            
            // Refresh books to update availability count
            if (query) {
                fetchBooks(query);
            } else {
                const params = new URLSearchParams(location.search);
                const category = params.get('category');
                if (category) {
                    const res = await axios.get(`/api/books/category/${category}`);
                    setBooks(res.data);
                }
            }
        } catch (err) {
            console.error(err);
            setErrorMessage(err.response?.data?.message || 'Error processing request');
            setActiveModal('error');
        }
    };

    return (
        <div className="search-page-container container page-theme-teal" style={{ minHeight: '80vh' }}>
            <div className="search-hero" style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', background: 'var(--bg-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Discover Your Next Read
                </h1>
                <p style={{ color: 'var(--gray-600)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Search through our extensive library by title, author, or category.
                </p>
            </div>

            <div className="search-bar-wrapper" style={{ maxWidth: '800px', margin: '0 auto 5rem' }}>
                <div className="premium-search-form" style={{ position: 'relative' }}>
                    <SearchIcon style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-600)' }} />
                    <input
                        type="text"
                        placeholder="Search for titles, authors, genres..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ paddingLeft: '4rem', width: '100%', height: '60px', borderRadius: '30px', border: '1px solid var(--gray-200)', fontSize: '1.1rem', boxShadow: 'var(--shadow-sm)', outline: 'none' }}
                    />
                    {loading && (
                        <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}>
                            <Loader2 className="animate-spin" color="var(--primary)" />
                        </div>
                    )}
                </div>
            </div>

            <div className="table-container" style={{ margin: '0 auto', maxWidth: '1000px' }}>
                <table className="books-table">
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Rating</th>
                            <th>Availability</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.length > 0 ? (
                            books.map((book) => (
                                <tr key={book._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <div className="table-book-title">{book.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{book.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="table-book-author">
                                            <User size={16} /> {book.author}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="table-rating">
                                            <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                            <span>{book.averageRating?.toFixed(1) || '0.0'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span 
                                            className="table-availability"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                background: book.availableCount > 0 ? '#dcfce7' : '#fee2e2',
                                                color: book.availableCount > 0 ? '#16a34a' : '#dc2626'
                                            }}
                                        >
                                            <Package size={14} />
                                            {book.availableCount > 0 
                                                ? `${book.availableCount} / ${book.totalCount} Available` 
                                                : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="borrow-btn"
                                                onClick={() => openBorrowModal(book)}
                                                disabled={book.availableCount <= 0}
                                                style={{ 
                                                    padding: '0.6rem 1.2rem', 
                                                    background: book.availableCount > 0 ? 'var(--primary)' : '#9ca3af', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    borderRadius: '8px', 
                                                    fontWeight: 600, 
                                                    cursor: book.availableCount > 0 ? 'pointer' : 'not-allowed', 
                                                    fontSize: '0.9rem' 
                                                }}
                                            >
                                                {book.availableCount > 0 ? 'Borrow' : 'Unavailable'}
                                            </button>
                                            <button
                                                onClick={() => openRateModal(book)}
                                                style={{ padding: '0.6rem 1.2rem', background: '#fffbeb', color: '#d97706', border: '1px solid #fcd34d', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
                                            >
                                                Rate
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                                    {!loading && query && (
                                        <div className="no-results">
                                            <div style={{ background: 'var(--gray-50)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                                <BookX size={40} color="var(--gray-600)" />
                                            </div>
                                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No books found</h3>
                                            <p style={{ color: 'var(--gray-600)' }}>Try a different term.</p>
                                        </div>
                                    )}
                                    {!loading && !query && (
                                        <p style={{ color: 'var(--gray-600)', fontStyle: 'italic' }}>
                                            Type above to start searching...
                                        </p>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {activeModal && (
                <div className="modal-overlay" onClick={closeModals}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {activeModal === 'rate' && (
                            <>
                                <h3 className="modal-title">Rate "{selectedBook?.title}"</h3>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRatingValue(star)}
                                            className="star-btn"
                                        >
                                            <Star
                                                size={32}
                                                fill={star <= ratingValue ? "#fbbf24" : "none"}
                                                color={star <= ratingValue ? "#fbbf24" : "#d1d5db"}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div className="modal-actions">
                                    <button className="btn-secondary" onClick={closeModals}>Cancel</button>
                                    <button className="btn-primary" onClick={submitRate}>Submit Rating</button>
                                </div>
                            </>
                        )}

                        {activeModal === 'borrow' && (
                            <>
                                <h3 className="modal-title">Borrow "{selectedBook?.title}"</h3>
                                <p style={{ 
                                    fontSize: '0.95rem', 
                                    marginBottom: '1rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    background: selectedBook?.availableCount > 0 ? '#dcfce7' : '#fee2e2',
                                    color: selectedBook?.availableCount > 0 ? '#16a34a' : '#dc2626',
                                    display: 'inline-block'
                                }}>
                                    <Package size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                                    {selectedBook?.availableCount} of {selectedBook?.totalCount} copies available
                                </p>
                                <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Do you recommend this book?</p>

                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="recommend"
                                            value="yes"
                                            checked={recommendValue === 'yes'}
                                            onChange={(e) => setRecommendValue(e.target.value)}
                                        /> Yes
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="recommend"
                                            value="no"
                                            checked={recommendValue === 'no'}
                                            onChange={(e) => setRecommendValue(e.target.value)}
                                        /> No
                                    </label>
                                </div>

                                {recommendValue === 'yes' && (
                                    <div className="star-rating">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRatingValue(star)}
                                                className="star-btn"
                                            >
                                                <Star
                                                    size={32}
                                                    fill={star <= ratingValue ? "#fbbf24" : "none"}
                                                    color={star <= ratingValue ? "#fbbf24" : "#d1d5db"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button className="btn-secondary" onClick={closeModals}>Cancel</button>
                                    <button className="btn-primary" onClick={submitBorrow}>Confirm Borrow</button>
                                </div>
                            </>
                        )}

                        {activeModal === 'success' && (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: '#dcfce7',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem'
                                }}>
                                    <CheckCircle size={48} color="#16a34a" />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#16a34a' }}>
                                    Borrowed Successfully!
                                </h3>
                                <p style={{ fontSize: '1.1rem', color: 'var(--gray-700)', marginBottom: '1.5rem' }}>
                                    {successMessage}
                                </p>
                                {dueDate && (
                                    <div style={{
                                        background: '#f0f9ff',
                                        border: '1px solid #bae6fd',
                                        borderRadius: '12px',
                                        padding: '1rem 1.5rem',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <Calendar size={20} color="#0284c7" />
                                            <span style={{ fontWeight: 600, color: '#0284c7' }}>Due Date</span>
                                        </div>
                                        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', margin: 0 }}>
                                            {dueDate}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                                            Book will auto-return after 10 days
                                        </p>
                                    </div>
                                )}
                                <button 
                                    className="btn-primary" 
                                    onClick={closeModals}
                                    style={{ 
                                        padding: '0.8rem 2rem',
                                        fontSize: '1rem',
                                        background: '#16a34a'
                                    }}
                                >
                                    OK, Got it!
                                </button>
                            </div>
                        )}

                        {activeModal === 'error' && (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: '#fee2e2',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem'
                                }}>
                                    <XCircle size={48} color="#dc2626" />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#dc2626' }}>
                                    Oops! Something went wrong
                                </h3>
                                <p style={{ fontSize: '1.1rem', color: 'var(--gray-700)', marginBottom: '1.5rem' }}>
                                    {errorMessage}
                                </p>
                                <button 
                                    className="btn-primary" 
                                    onClick={closeModals}
                                    style={{ 
                                        padding: '0.8rem 2rem',
                                        fontSize: '1rem',
                                        background: '#dc2626'
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
