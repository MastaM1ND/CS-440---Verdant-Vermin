import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; 

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('Signup successful! Please log in.');
        navigate('/');
      } else {
        alert(data.message || 'Signup failed.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('Server error.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Create Account</h1>
        <p className="subtitle">Join a study group, or create your own.</p>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
