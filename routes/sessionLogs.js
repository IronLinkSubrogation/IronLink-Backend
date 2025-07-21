// routes/sessionLogs.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

const logPath = path.join(__dirname, '../logs/activity.json');

// 🔐 Protect route with role-based access
router.use(protect);
router.use(authorizeRole(['admin'])); // Only admins see full session audit

// ✅ GET /session/logs → Filter login/session events from audit log
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
