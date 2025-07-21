// routes/summaryFollowupsStatus.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { protect, authorizeRole } = require('../middleware/authMiddleware');
const casePath = path.join(__dirname, '../data/cases.json');

router.use(protect);
router.use(authorizeRole(['admin'])); // summary data is admin-only

// 🔹 GET /summary/followups/status → count cases grouped by status
router.get('/', (req, res) => {
  const cases = fs.existsSync(casePath)
    ? JSON.parse(fs.readFileSync(casePath, 'utf-8'))
    : [];

  const breakdown = {};

  cases.forEach(c => {
    const status = c.status || 'unknown';
    breakdown[status] = (breakdown[status] || 0) + 1;
  });

  res.json({
    statusBreakdown: breakdown,
    total: cases.length,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
