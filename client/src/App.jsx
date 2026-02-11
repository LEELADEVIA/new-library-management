import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
