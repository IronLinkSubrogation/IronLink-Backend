const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { protect, authorizeRole } = require('../middleware/authMiddleware');

// 🔹 Flat file paths
const casePath = path.join(__dirname, '../data/cases.json');
const logPath  = path.join(__dirname, '../logs/sessionLogs.json');

router.use(protect);
router.use(authorizeRole(['admin'])); // Only accessible by admins

router.get('/', (req, res) => {
  const cases = fs.existsSync(casePath)
    ? JSON.parse(fs.readFileSync(casePath, 'utf-8'))
    : [];

  const logs = fs.existsSync(logPath)
    ? JSON.parse(fs.readFileSync(logPath, 'utf-8'))
    : [];

  // 🔹 Diary logic: match today's follow-ups
  const today = new Date().toISOString().split('T')[0];
  const diaryToday = cases.filter(c => {
    if (!c.followUpDate) return false;
    const followUp = new Date(c.followUpDate).toISOString().split('T')[0];
    return followUp === today;
  });

  // 🔹 Upcoming follow-ups in next 7 days
  const windowDays = 7;
  const now = new Date();
  const threshold = new Date();
  threshold.setDate(now.getDate() + windowDays);

  const upcomingFollowups = cases.filter(c => {
    if (!c.followUpDate) return false;
    const d = new Date(c.followUpDate);
    return d >= now && d <= threshold;
  });

  // 🔹 Status breakdown
  const statusBreakdown = {};
  cases.forEach(c => {
    const status = c.status || 'unknown';
    statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
  });

  // 🔹 Recent logs within 24 hours
  const recentLogs = logs.filter(log => {
    const timestamp = new Date(log.timestamp);
    return timestamp >= new Date(Date.now() - 1000 * 60 * 60 * 24);
  });

  // 🔹 Return structure
  res.json({
    role: req.user.role,
    summary: {
      upcomingFollowups: {
        count: upcomingFollowups.length,
        range: `Next ${windowDays} Days`,
        action: {
          label: 'View Upcoming',
          method: 'GET',
          target: `/summary/followups?within=${windowDays}`
        }
      },
      statusBreakdown,
      diaryToday: {
        count: diaryToday.length,
        date: today,
        action: {
          label: 'View Diary',
          method: 'GET',
          target: `/case/diary?day=${today}`
        }
      },
      sessionLogs: {
        recent: recentLogs.length,
        action: {
          label: 'View Logs',
          method: 'GET',
          target: '/session/logs'
        }
      }
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
