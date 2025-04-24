import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../componentsCSS/NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/'); // Redirect to login
  };

  return (
    <nav className="navbar">
      <div className="navbar_left">
        <Link to="/groups" className="navbar_logo">
          Study Group Finder
        </Link>
      </div>

      <div className="navbar_center">
        {user && (
          <ul className="navbar_links">
            <li><Link to="/groups">Home</Link></li>
            <li><Link to="/create_group">Create Group</Link></li>
            <li><Link to="/account">Account</Link></li>
          </ul>
        )}
      </div>

      <div className="navbar_right">
        <ul className="navbar_links">
          {user ? (
            <li><button onClick={handleLogout}>Log Out</button></li>
          ) : (
            <>
              <li><Link to="/">Log In</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
