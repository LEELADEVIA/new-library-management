import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Cpu, Atom, Scroll, GraduationCap, ChevronRight, Search as SearchIcon, User, Star, FileText, BookOpen } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const categoryIcons = {
    'Story Books': <Book size={48} />,
    'Biography Books': <User size={48} />,
    'Education Book': <GraduationCap size={48} />,
    'Popular Book': <Star size={48} />,
    'Fiction': <BookOpen size={48} />,
    'Non Fiction': <FileText size={48} />
};

const Home = () => {
    const [categories, setCategories] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/books/categories');
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="home-container container" style={{ paddingTop: '2rem' }}>
            <div className="home-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '3rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {user?.username}</h1>
                    <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem' }}>Select a category to start browsing</p>
                </div>
                <button
                    onClick={() => navigate('/search')}
                    className="auth-btn"
                    style={{
                        width: 'auto',
                        padding: '0.8rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem'
                    }}
                >
                    <SearchIcon size={20} />
                    Global Search
                </button>
            </div>

            <div className="categories-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '2rem'
            }}>
                {categories.map((category) => (
                    <div
                        key={category}
                        className="category-card"
                        onClick={() => navigate(`/search?category=${category}`)}
                        style={{
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: '1px solid var(--gray-200)',
                            borderRadius: '16px',
                            background: 'white',
                            height: '100%'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = 'var(--gray-200)';
                        }}
                    >
                        <div className="category-icon" style={{
                            color: 'var(--primary)',
                            background: 'var(--primary-light)',
                            padding: '1.5rem',
                            borderRadius: '50%',
                            marginBottom: '1rem'
                        }}>
                            {categoryIcons[category] || <Book size={48} />}
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{category}</h3>
                        <span style={{
                            fontSize: '0.9rem',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            marginTop: 'auto'
                        }}>
                            Explore <ChevronRight size={16} />
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
