// routes/summaryFollowupsStatus.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorizeRole(['admin']));

const casePath = path.join(__dirname, '../data/cases.json');

router.get('/', (req, res) => {
  const cases = fs.existsSync(casePath)
    ? JSON.parse(fs.readFileSync(casePath, 'utf-8'))
    : [];

  const now = new Date();
  const upcomingWindow = parseInt(req.query.within) || 7;
  const upcomingThreshold = new Date();
  upcomingThreshold.setDate(now.getDate() + upcomingWindow);

  const breakdown = {};

  cases.forEach(c => {
    const status = (c.status || 'unknown').toLowerCase();
    const followUp = c.followUpDate ? new Date(c.followUpDate) : null;

    if (!breakdown[status]) {
      breakdown[status] = { overdue: 0, upcoming: 0, missing: 0 };
    }

    if (!followUp) {
      breakdown[status].missing++;
    } else if (followUp < now) {
      breakdown[status].overdue++;
    } else if (followUp >= now && followUp <= upcomingThreshold) {
      breakdown[status].upcoming++;
    }
  });

  res.json({
    timestamp: new Date().toISOString(),
    followUps: breakdown,
    range: {
      upcomingWindow: `${upcomingWindow} days`,
      referenceDate: now.toISOString()
    }
  });
});

module.exports = router;
