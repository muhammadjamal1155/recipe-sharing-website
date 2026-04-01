import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Utensils, Search, User, LogOut, Menu } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="navbar-brand">
          <Utensils color="var(--primary)" size={28} />
          RecipeHub
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/recipes" className={`nav-link ${isActive('/recipes')}`}>Browse </Link>
          <Link to="/submit" className={`nav-link ${isActive('/submit')}`}>Submit </Link>
          {user ? (
            <>
              <Link to="/profile" className={`nav-link ${isActive('/profile')}`} style={{display: 'flex', alignItems: 'center', gap: '0.2rem'}}>
                <User size={18} /> {user}
              </Link>
              <button onClick={handleLogout} className="nav-link" style={{display: 'flex', alignItems: 'center', gap: '0.2rem'}}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
