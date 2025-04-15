const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // 🔒 for password hashing

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'youShallPass1!',  
  database: 'study_group_finder'
});

db.connect(err => {
  if (err) {
    console.error('DB connection error:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// ==========================
// GET all study groups
// ==========================
app.get('/groups', (req, res) => {
  db.query('SELECT * FROM study_groups', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ==========================
// POST Signup
// ==========================
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const password_hash = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, password_hash],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Email may already exist or DB error' });
        }
        res.json({ success: true });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});

// ==========================
// POST Login
// ==========================
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.json({ success: false, message: 'User not found' });
    }

    const user = results[0];

    try {
      const match = await bcrypt.compare(password, user.password_hash);
      if (match) {
        res.json({ success: true, user_id: user.user_id });
      } else {
        res.json({ success: false, message: 'Incorrect password' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Login error' });
    }
  });
});

// ==========================
// Start Server
// ==========================
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
