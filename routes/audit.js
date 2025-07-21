// routes/audit.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

const logPath = path.join(__dirname, '../logs/activity.json');

// 🔐 Apply security middleware
router.use(protect); // Checks for x-user-role header
router.use(authorizeRole(['admin'])); // Only allow admins

/**
 * GET /audit
 * Optional filtering via query params: ?role=employee&action=CREATE_CASE
 */
router.get('/', (req, res) => {
  if (!fs.existsSync(logPath)) {
    return res.status(404).json({ error: 'Activity log file not found.' });
  }

  const logs = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
  const { role, action } = req.query;

  let filtered = logs;
  if (role) filtered = filtered.filter(entry => entry.role === role);
  if (action) filtered = filtered.filter(entry => entry.action === action);

  res.json(filtered);
});

/**
 * GET /audit/export
 * Returns the full log file as a downloadable attachment
 */
router.get('/export', (req, res) => {
  if (!fs.existsSync(logPath)) {
    return res.status(404).json({ error: 'Activity log file not found.' });
  }

  res.download(logPath, 'ironlink-activity-log.json', err => {
    if (err) {
      console.error('🚫 Export failed:', err);
      res.status(500).json({ error: 'Failed to export log file.' });
    }
  });
});

module.exports = router;
