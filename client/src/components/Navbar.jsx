import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Library, LayoutGrid, Search as SearchIcon, FileText, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="nav-logo">
                <Library size={32} />
                <span>Smart Library</span>
            </div>

            <ul className="nav-links">
                {user ? (
                    <>
                        <li className={isActive('/') ? 'active' : ''}>
                            <Link to="/"><LayoutGrid size={18} /> Home</Link>
                        </li>
                        <li className={isActive('/search') ? 'active' : ''}>
                            <Link to="/search"><SearchIcon size={18} /> Search</Link>
                        </li>
                        <li className={isActive('/reports') ? 'active' : ''}>
                            <Link to="/reports"><FileText size={18} /> Reports</Link>
                        </li>
                        <li className="user-profile">
                            <span className="welcome-text">
                                <User size={16} /> {user.username}
                            </span>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="logout-btn">
                                <LogOut size={18} /> Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li className={isActive('/login') ? 'active' : ''}>
                            <Link to="/login">Login</Link>
                        </li>
                        <li className={isActive('/register') ? 'active' : ''}>
                            <Link to="/register" className="auth-btn" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', width: 'auto' }}>
                                Sign Up
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
