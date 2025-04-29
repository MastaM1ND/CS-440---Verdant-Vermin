const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Connect to Supabase PostgreSQL
const db = new Client({
  host: 'db.pbhtnogygaoebydhivhf.supabase.co', 
  port: 5432,
  user: 'postgres',
  password: 'youShallPass1!', 
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect()
  .then(() => console.log('Connected to Supabase PostgreSQL'))
  .catch((err) => console.error('DB connection error:', err));

// Health Check
app.get('/', (req, res) => {
  res.send('Supabase-Connected API is running!');
});

// ==========================
// User Signup
// ==========================
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const password_hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, email, password_hash]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (match) {
      res.json({ success: true, user_id: user.user_id });
    } else {
      res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// ==========================
// Groups API
// ==========================

// Get All Groups
app.get('/groups', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM study_groups');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(500).json({ error: 'Failed to fetch study groups' });
  }
});

// Create a Group
app.post('/create_group', async (req, res) => {
  const { group_name, course, group_type, max_members } = req.body;
  const user_id = req.headers['user_id'];

  try {
    const course_result = await db.query(
      'SELECT course_id FROM courses WHERE course_name = $1',
      [course]
    );
    const course_id = course_result.rows[0]?.course_id;

    await db.query(
      'INSERT INTO study_groups (group_name, group_type, max_members, group_course_id) VALUES ($1, $2, $3, $4)',
      [group_name, group_type, max_members, course_id]
    );

    const study_group_result = await db.query(
      'SELECT group_id FROM study_groups WHERE group_name = $1',
      [group_name]
    );
    const study_group_id = study_group_result.rows[0]?.group_id;

    await db.query(
      'INSERT INTO group_members (study_group_id, member_id, role, status) VALUES ($1, $2, $3, $4)',
      [study_group_id, user_id, "Creator", "Active"]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Group Creation error:', err);
    res.status(500).json({ success: false, message: 'Failed to Create Group' });
  }
});

// Join a Group
app.post('/groups/:id/join', async (req, res) => {
  const groupId = req.params.id;
  const { user_id } = req.body;

  try {
    const check = await db.query(
      'SELECT * FROM group_members WHERE study_group_id = $1 AND member_id = $2',
      [groupId, user_id]
    );

    if (check.rows.length > 0) {
      return res.json({ success: false, message: 'You are already a member of this group.' }); // 🔥 No more 400 error!
    }

    await db.query(
      'INSERT INTO group_members (study_group_id, member_id, role, status) VALUES ($1, $2, $3, $4)',
      [groupId, user_id, 'member', 'active']
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Join group error:', err);
    res.status(500).json({ success: false, message: 'Failed to join group' });
  }
});

// Get Group Details
app.get('/groups/:id', async (req, res) => {
  const groupId = req.params.id;
  try {
    const result = await db.query('SELECT * FROM study_groups WHERE group_id = $1', [groupId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    res.json({ success: true, group: result.rows[0] });
  } catch (err) {
    console.error('Group fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch group' });
  }
});

// ==========================
// Messages API
// ==========================

// Get Messages for Group
app.get('/groups/:id/messages', async (req, res) => {
  const groupId = req.params.id;
  try {
    const result = await db.query(
      'SELECT m.content, m.timestamp, u.email AS sender FROM messages m JOIN users u ON m.sender_id = u.user_id WHERE m.receiving_group_id = $1 ORDER BY m.timestamp ASC',
      [groupId]
    );
    res.json({ success: true, messages: result.rows });
  } catch (err) {
    console.error('Messages fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// Send a Message
app.post('/groups/:id/messages', async (req, res) => {
  const groupId = req.params.id;
  const { user_id, content } = req.body;
  try {
    await db.query(
      'INSERT INTO messages (content, timestamp, receiving_group_id, sender_id) VALUES ($1, NOW(), $2, $3)',
      [content, groupId, user_id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Message send error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// ==========================
// Server Listen
// ==========================
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

