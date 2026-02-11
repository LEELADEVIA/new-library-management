import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, BookOpen, User, ShoppingBag, ChevronRight, BookX } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, loading } = useContext(CartContext);

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '10rem' }}>Loading your cart...</div>;

    return (
        <div className="cart-page-container container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
            <div className="cart-header" style={{ marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, background: 'var(--bg-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <ShoppingBag size={48} color="var(--primary)" /> My Library Cart
                </h1>
                <p style={{ color: 'var(--gray-600)', fontSize: '1.2rem' }}>You have {cartItems.length} books ready for borrowing.</p>
            </div>

            {cartItems.length > 0 ? (
                <div className="cart-content" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '3rem' }}>
                    <div className="cart-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {cartItems.map((item) => (
                            <div key={item._id} className="cart-item-card" style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: '2rem', transition: 'transform 0.2s' }}>
                                <div style={{ width: '60px', height: '80px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <BookOpen size={32} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>{item.bookId.title}</h3>
                                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--gray-600)', fontSize: '0.95rem' }}>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <User size={14} /> {item.bookId.author}
                                        </p>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <span style={{ padding: '2px 8px', background: '#f5f3ff', color: 'var(--primary)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                {item.bookId.category}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.bookId._id)}
                                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                                    title="Remove from cart"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary" style={{ background: 'white', padding: '2.5rem', borderRadius: '2rem', boxShadow: 'var(--shadow-card)', border: '1px solid var(--gray-50)', height: 'fit-content' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-dark)' }}>Summary</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--gray-600)' }}>
                            <span>Total Books Selected:</span>
                            <span style={{ fontWeight: 800, color: 'var(--text-dark)' }}>{cartItems.length}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                            Ready to take these home? You can borrow them all at once or continue exploring.
                        </p>
                        <button style={{ width: '100%', padding: '1.25rem', background: 'var(--bg-gradient)', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)', marginBottom: '1rem' }}>
                            Confirm & Borrow All
                        </button>
                        <Link to="/search" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
                            <ChevronRight size={18} /> Continue Browsing
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="empty-cart" style={{ textAlign: 'center', padding: '8rem 0', background: 'white', borderRadius: '2rem', border: '2px dashed var(--gray-200)' }}>
                    <div style={{ background: 'var(--gray-50)', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <BookX size={64} color="var(--gray-400)" />
                    </div>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '1rem' }}>Your cart is empty</h2>
                    <p style={{ color: 'var(--gray-600)', fontSize: '1.2rem', marginBottom: '3rem' }}>Looks like you haven't picked anything yet. Start exploring the library!</p>
                    <Link to="/search" className="explore-btn" style={{ padding: '1.25rem 3rem' }}>Browse Books</Link>
                </div>
            )}
        </div>
    );
};

export default Cart;
