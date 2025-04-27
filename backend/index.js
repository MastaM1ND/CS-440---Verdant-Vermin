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

// ==========================
// Health Check
// ==========================
app.get('/', (req, res) => {
  res.send('Supabase-Connected API is running!');
});

// ==========================
// Get Study Groups
// ==========================
app.get('/groups', async (req, res) => {
  try {
    const result = await db.query('SELECT sg.*,COUNT(gm.member_id) AS member_count FROM study_groups sg\
                                  LEFT JOIN group_members gm ON sg.group_id = gm.study_group_id\
                                  GROUP BY sg.group_id;');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(500).json({ error: 'Failed to fetch study groups' });
  }
});

// ==========================
// Signup Route
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

// ==========================
// Login Route
// ==========================
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


/**
 * create group route
 */
app.post('/create_group', async (req, res) => {
  const { group_name, course, group_type, max_members } = req.body;
  const user_id = req.headers['user_id'];

  try {

    const course_result = await db.query(
      'SELECT course_id FROM courses WHERE course_name = $1',
      [course]
    )
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
      [study_group_id, user_id, "creator", "active"]
    )

    res.json({ success: true });

  } catch (err) {
    console.error('Group Creation error:', err);
    res.status(500).json({ success: false, message: 'Failed to Create Group' });
  }
});

// ==========================
// Join a Study Group
// ==========================
app.post('/groups/:id/join', async (req, res) => {
  const groupId = req.params.id;
  const { user_id } = req.body;

  try {
    // Check if already a member
    const check = await db.query(
      'SELECT * FROM group_members WHERE study_group_id = $1 AND member_id = $2',
      [groupId, user_id]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'You are already a member of this group.' });
    }

    // Add member
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


/**
 * Listen to port and log url
 */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
