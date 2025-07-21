// routes/diary.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { protect, authorizeRole } = require('../middleware/authMiddleware');
const casePath = path.join(__dirname, '../data/cases.json');

router.use(protect);
router.use(authorizeRole(['admin', 'employee'])); // 📅 diary is employee-accessible

// 🔹 GET /case/diary?day=2025-07-21 → returns cases with follow-up set for that day
router.get('/', (req, res) => {
  const cases = fs.existsSync(casePath)
    ? JSON.parse(fs.readFileSync(casePath, 'utf-8'))
    : [];

  const queryDay = req.query.day
    ? new Date(req.query.day)
    : new Date();

  const targetDate = queryDay.toISOString().split('T')[0];

  const matches = cases.filter(c => {
    if (!c.followUpDate) return false;
    const followUpDate = new Date(c.followUpDate).toISOString().split('T')[0];
    return followUpDate === targetDate;
  });

  res.json({
    date: targetDate,
    matchCount: matches.length,
    cases: matches
  });
});

module.exports = router;
