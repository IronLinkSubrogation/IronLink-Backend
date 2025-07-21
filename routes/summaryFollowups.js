// routes/summaryFollowups.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

const casePath = path.join(__dirname, '../data/cases.json');

router.use(protect);
router.use(authorizeRole(['admin'])); // restrict to admins

// GET /summary/followups → count cases with followUpDate in next 7 days
router.get('/', (req, res) => {
  const cases = fs.existsSync(casePath)
    ? JSON.parse(fs.readFileSync(casePath, 'utf-8'))
    : [];

  const now = new Date();
  const window = parseInt(req.query.within) || 7;
  const threshold = new Date();
  threshold.setDate(now.getDate() + window);

  const upcoming = cases.filter(c => {
    if (!c.followUpDate) return false;
    const followUp = new Date(c.followUpDate);
    return followUp >= now && followUp <= threshold;
  });

  res.json({
    upcomingCount: upcoming.length,
    window: `${window} days`,
    timestamp: now.toISOString()
  });
});

module.exports = router;
