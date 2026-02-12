import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, TrendingUp, BookOpen, MessageSquare, Send, Star, User } from 'lucide-react';

const Reports = () => {
    const [recommendations, setRecommendations] = useState({ highestRated: [], mostBorrowed: [] });
    const [activity, setActivity] = useState({ mostBorrowed: [], mostRated: [] });
    const [queries, setQueries] = useState([]);
    const [newQuery, setNewQuery] = useState({ bookTitle: '', question: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const recRes = await axios.get('/api/reports/recommendations');
                const actRes = await axios.get('/api/reports/activity');
                setRecommendations(recRes.data);
                setActivity(actRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleQuerySubmit = (e) => {
        e.preventDefault();
        if (!newQuery.bookTitle || !newQuery.question) return;

        const queryObj = {
            id: Date.now(),
            bookTitle: newQuery.bookTitle,
            question: newQuery.question,
            date: new Date().toLocaleDateString()
        };

        setQueries([queryObj, ...queries]);
        setNewQuery({ bookTitle: '', question: '' });
        alert('Query submitted successfully!');
    };

    const ReportCard = ({ title, icon: Icon, data, type }) => (
        <div className="report-card" style={{
            background: 'white',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: 'var(--shadow-card)',
            height: '100%'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                    padding: '0.8rem',
                    background: 'var(--bg-gradient)',
                    borderRadius: '12px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-dark)' }}>{title}</h3>
            </div>

            <div className="report-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.map((book, index) => (
                    <div key={book._id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: 'var(--gray-50)',
                        borderRadius: '1rem',
                        transition: 'transform 0.2s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                        <span style={{
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            color: 'var(--gray-200)',
                            minWidth: '30px'
                        }}>#{index + 1}</span>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.2rem' }}>{book.title}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                                {type === 'rating' && (
                                    <>
                                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                        <span>{book.averageRating?.toFixed(1)} ({book.totalRatings})</span>
                                    </>
                                )}
                                {type === 'borrow' && (
                                    <>
                                        <BookOpen size={14} />
                                        <span>{book.borrowCount} borrows</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="reports-container container page-theme-violet" style={{ paddingBottom: '5rem', minHeight: '80vh' }}>
            <div className="reports-header" style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    marginBottom: '1rem',
                    background: 'var(--bg-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Library Insights & Reports
                </h1>
                <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem' }}>
                    Track top performing books and user engagement
                </p>
            </div>

            <div className="reports-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2.5rem',
                marginBottom: '5rem'
            }}>
                <ReportCard
                    title="Highest Rated Books"
                    icon={Star}
                    data={recommendations.highestRated}
                    type="rating"
                />
                <ReportCard
                    title="Most Borrowed Books"
                    icon={TrendingUp}
                    data={recommendations.mostBorrowed}
                    type="borrow"
                />
                <ReportCard
                    title="Most Active Books (Rated)"
                    icon={BarChart}
                    data={activity.mostRated}
                    type="rating"
                />
            </div>

            <section className="queries-section" style={{
                background: 'white',
                borderRadius: '2rem',
                padding: '3rem',
                boxShadow: 'var(--shadow-card)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: '50%', color: '#059669' }}>
                            <MessageSquare size={32} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)' }}>Librarian Assist</h2>
                            <p style={{ color: 'var(--gray-600)' }}>Have a question about a book? Ask us correctly.</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                        <form onSubmit={handleQuerySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--gray-600)' }}>Book Title</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <BookOpen size={20} style={{ position: 'absolute', left: '1rem', color: 'var(--gray-400)' }} />
                                    <input
                                        type="text"
                                        value={newQuery.bookTitle}
                                        onChange={(e) => setNewQuery({ ...newQuery, bookTitle: e.target.value })}
                                        placeholder="e.g. Harry Potter"
                                        style={{
                                            width: '100%',
                                            padding: '1rem 1rem 1rem 3rem',
                                            borderRadius: '12px',
                                            border: '2px solid var(--gray-100)',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s'
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--gray-600)' }}>Your Question</label>
                                <textarea
                                    value={newQuery.question}
                                    onChange={(e) => setNewQuery({ ...newQuery, question: e.target.value })}
                                    placeholder="Is this book available in hardcover?..."
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '2px solid var(--gray-100)',
                                        fontSize: '1rem',
                                        minHeight: '120px',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                    required
                                />
                            </div>

                            <button type="submit" className="auth-btn" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                marginTop: '1rem'
                            }}>
                                <Send size={20} />
                                Submit Query
                            </button>
                        </form>

                        <div className="recent-queries">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Recent Queries</h3>
                            <div style={{
                                maxHeight: '400px',
                                overflowY: 'auto',
                                paddingRight: '1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                {queries.length > 0 ? (
                                    queries.map(q => (
                                        <div key={q.id} style={{
                                            background: 'var(--gray-50)',
                                            padding: '1.5rem',
                                            borderRadius: '16px',
                                            border: '1px solid var(--gray-100)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <h4 style={{ fontWeight: 700, color: 'var(--primary)' }}>{q.bookTitle}</h4>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)', background: 'white', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>{q.date}</span>
                                            </div>
                                            <p style={{ color: 'var(--gray-600)', lineHeight: 1.5 }}>"{q.question}"</p>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '3rem',
                                        border: '2px dashed var(--gray-200)',
                                        borderRadius: '16px',
                                        color: 'var(--gray-600)'
                                    }}>
                                        <MessageSquare size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                        <p>No queries yet. Be the first to ask!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Reports;
