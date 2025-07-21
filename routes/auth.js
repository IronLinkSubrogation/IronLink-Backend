// routes/auth.js
const express = require('express');
const router = express.Router();

// 🔐 Hardcoded mock users
const USERS = [
  { username: 'joshua', password: 'founder123', role: 'admin' },
  { username: 'vanessa', password: 'analyst123', role: 'employee' },
  { username: 'guest', password: 'visitor123', role: 'guest' }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const matched = USERS.find(u => u.username === username && u.password === password);

  if (!matched) return res.status(401).json({ error: 'Invalid credentials' });

  // Simulate session (for now, send back the role)
  res.json({ message: 'Login successful', role: matched.role });
});

module.exports = router;
