// routes/sessionLogs.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { protect, authorizeRole } = require('../middleware/authMiddleware');
const logPath = path.join(__dirname, '../logs/sessionLogs.json');

router.use(protect);
router.use(authorizeRole(['admin'])); // audit data is admin-only

// 🔹 GET /session/logs → return session logs with optional filtering
router.get('/', (req, res) => {
  const logs = fs.existsSync(logPath)
    ? JSON.parse(fs.readFileSync(logPath, 'utf-8'))
    : [];

  const { user, after, before } = req.query;

  const filtered = logs.filter(log => {
    if (user && log.user !== user) return false;
    if (after && new Date(log.timestamp) < new Date(after)) return false;
    if (before && new Date(log.timestamp) > new Date(before)) return false;
    return true;
  });

  res.json({
    total: logs.length,
    filtered: filtered.length,
    results: filtered
  });
});

module.exports = router;
