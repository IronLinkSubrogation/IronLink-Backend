// routes/summaryFollowups.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorizeRole(['admin'])); // restrict to admin summary access

const casePath = path.join(__dirname, '../data/cases.json');

router.get('/', (req, res) => {
  const cases = fs.existsSync(casePath)
    ? JSON.parse(fs.readFileSync(casePath, 'utf-8'))
    : [];

  const now = new Date();
  const upcomingDays = parseInt(req.query.within) || 7;
  const upcomingThreshold = new Date();
  upcomingThreshold.setDate(now.getDate() + upcomingDays);

  let overdue = 0;
  let upcoming = 0;
  let missing = 0;

  cases.forEach(c => {
    if (!c.followUpDate) {
      missing++;
    } else {
      const date = new Date(c.followUpDate);
      if (date < now) overdue++;
      else if (date >= now && date <= upcomingThreshold) upcoming++;
    }
  });

  res.json({
    timestamp: new Date().toISOString(),
    followUps: {
      overdue,
      upcoming,
      missing
    },
    range: {
      upcomingWindow: `${upcomingDays} days`,
      referenceDate: now.toISOString()
    }
  });
});

module.exports = router;
