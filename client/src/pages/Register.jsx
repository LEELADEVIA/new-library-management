import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Frontend Validation
        if (!username || !email || !password || !confirmPassword) {
            return setError('All fields are required');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return setError('Please enter a valid email address');
        }

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters long');
        }

        try {
            const res = await axios.post('/api/auth/register', { username, email, password });
            setSuccess(res.data.message || 'Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error('Frontend registration error:', err);
            setError(err.response?.data?.error || err.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card">
                <div className="auth-left auth-sidebar">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="80" fill="rgba(168, 85, 247, 0.1)" />
                        <path d="M40 140 Q100 80 160 140 L160 170 Q100 110 40 170 Z" fill="#a855f7" opacity="0.8" />
                        <circle cx="100" cy="80" r="30" fill="#6366f1" />
                        <rect x="70" y="100" width="60" height="10" rx="5" fill="white" opacity="0.3" />
                    </svg>
                    <h2>Join Us!</h2>
                    <p>Create your account and start your learning journey with our Smart Library system today.</p>
                </div>

                <div className="auth-right auth-form-container">
                    <div className="auth-header">
                        <h3>Create Account</h3>
                        <p>Join our student community</p>
                    </div>

                    {error && <div className="error-alert" style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontWeight: '600', fontSize: '0.9rem' }}>{error}</div>}
                    {success && <div className="success-alert" style={{ color: '#059669', backgroundColor: '#d1fae5', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontWeight: '600', fontSize: '0.9rem' }}>{success}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Username</label>
                            <div className="input-container">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Confirm Password</label>
                            <div className="input-container">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Repeat password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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

                        <button type="submit" className="auth-btn" style={{ marginTop: '1rem' }}>Get Started</button>
                    </form>

                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Login Instead</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
