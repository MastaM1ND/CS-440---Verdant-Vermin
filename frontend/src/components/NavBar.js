import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../componentsCSS/NavBar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user_id'); // Clear the token
        navigate('/'); // Redirect to login page
    };

    return (

        <nav className="navbar">
            <div className="navbar_left">
                <Link to="/groups" className="navbar_logo">
                    Study Group Finder
                </Link>
            </div>
            <div className="navbar_center">
                <ul className="navbar_links">
                    <li><Link to="/groups">Home</Link></li>
                    <li><Link to="/create_group">Create Group</Link></li>
                    <li><Link to="/account">Account</Link></li>
                </ul>
            </div>
            <div className="navbar_right">
                <ul className="navbar_links">
                    <li><button onClick={handleLogout}>Log Out</button></li>
                </ul>
            </div>

        </nav>
    );
};

export default Navbar;