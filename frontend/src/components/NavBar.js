import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../componentsCSS/NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/groups">📚 Study Group Finder</Link>
      </div>

      {user && (
        <div className="navbar-links">
          <Link to="/groups">Home</Link>
          <Link to="/create_group">Create Group</Link>
          <Link to="/account">Account</Link>
        </div>
      )}

      <div className="navbar-actions">
        {user ? (
          <button onClick={handleLogout}>Log Out</button>
        ) : (
          <>
            <Link to="/">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
