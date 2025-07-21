// routes/audit.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

const logPath = path.join(__dirname, '../logs/activity.json');

// 🔐 Only allow access for admin
router.use(protect);
router.use(authorizeRole(['admin']));

router.get('/', (req, res) => {
  if (!fs.existsSync(logPath)) {
    return res.status(404).json({ error: 'Log file not found.' });
  }

  const logs = JSON.parse(fs.readFileSync(logPath));

  // Optional filtering via query: ?role=employee&action=CREATE_CASE
  const { role, action } = req.query;

  let filtered = logs;
  if (role) filtered = filtered.filter(log => log.role === role);
  if (action) filtered = filtered.filter(log => log.action === action);

  res.json(filtered);
});

module.exports = router;
