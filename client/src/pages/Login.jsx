import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            login(res.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card">
                <div className="auth-left auth-sidebar">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="80" fill="rgba(99, 102, 241, 0.1)" />
                        <path d="M60 70 L140 70 L140 150 L60 150 Z" fill="#6366f1" opacity="0.8" />
                        <path d="M60 70 L100 40 L140 70" fill="#4f46e5" />
                        <rect x="75" y="90" width="50" height="40" rx="4" fill="white" opacity="0.3" />
                        <rect x="85" y="105" width="30" height="4" rx="2" fill="white" />
                        <rect x="85" y="115" width="30" height="4" rx="2" fill="white" />
                    </svg>
                    <h2>Smart Library</h2>
                    <p>Access thousands of books and resources curated just for you.</p>
                </div>

                <div className="auth-right auth-form-container">
                    <div className="auth-header">
                        <h3>Welcome Back!</h3>
                        <p>Unlock your gateway to knowledge</p>
                    </div>

                    {error && <div className="error-alert" style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontWeight: '600', fontSize: '0.9rem' }}>{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Email Address</label>
                            <div className="input-container">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Password</label>
                            <div className="input-container">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-extras">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-pw">Forgot password?</a>
                        </div>

                        <button type="submit" className="auth-btn">Sign In to Account</button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/register">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
