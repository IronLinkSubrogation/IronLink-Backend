// routes/session.js
const express = require('express');
const router = express.Router();

router.get('/me', (req, res) => {
  const role = req.headers['x-user-role'];
  if (!role) {
    return res.status(401).json({ error: 'Not authenticated. Role header missing.' });
  }

  // This is a mock introspection—later we can enrich it with real user data
  res.json({
    authenticated: true,
    role,
    message: `Welcome, ${role}`
  });
});

module.exports = router;
