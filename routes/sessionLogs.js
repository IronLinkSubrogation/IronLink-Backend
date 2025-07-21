// routes/sessionLogs.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

const logPath = path.join(__dirname, '../logs/activity.json');

router.use(protect);
router.use(authorizeRole(['admin'])); // Restrict access to admin users only

// ✅ GET /session/logs → View session activity
router.get('/', (req, res) => {
  const logs = fs.existsSync(logPath)
    ? JSON.parse(fs.readFileSync(logPath, 'utf-8'))
    : [];

  const sessionEvents = logs.filter(entry =>
    ['LOGIN', 'LOGOUT', 'SESSION_CHECK'].includes(entry.action)
  );

  res.json({
    timestamp: new Date().toISOString(),
    sessionEvents
  });
});

module.exports = router;
