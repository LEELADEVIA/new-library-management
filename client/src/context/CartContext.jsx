import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const fetchCart = async () => {
        if (!user) return;
        try {
            const res = await axios.get('http://localhost:5000/api/cart', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setCartItems(res.data);
        } catch (err) {
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
            setLoading(false);
        }
    }, [user]);

    const addToCart = async (bookId) => {
        try {
            await axios.post('http://localhost:5000/api/cart', { bookId }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            await fetchCart();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Error adding to cart' };
        }
    };

    const removeFromCart = async (bookId) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/${bookId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            await fetchCart();
        } catch (err) {
            console.error('Error removing from cart:', err);
        }
    };

    const isInCart = (bookId) => {
        return cartItems.some(item => item.bookId._id === bookId || item.bookId === bookId);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, isInCart, loading, refreshCart: fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
