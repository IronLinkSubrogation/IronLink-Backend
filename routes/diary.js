// routes/diary.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

const dataPath = path.join(__dirname, '../data/cases.json');

router.use(protect);
router.use(authorizeRole(['admin', 'employee']));

// ✅ GET /case/diary → cases needing follow-up before specified date
router.get('/', (req, res) => {
  const { before } = req.query;
  if (!before) return res.status(400).json({ error: 'Missing ?before=YYYY-MM-DD' });

  const cases = fs.existsSync(dataPath)
    ? JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    : [];

  const filtered = cases.filter(c => {
    if (!c.followUpDate) return false;
    return new Date(c.followUpDate) <= new Date(before);
  });

  res.json(filtered);
});

// ✅ GET /case/diary/overdue → cases past due follow-up
router.get('/overdue', (req, res) => {
  const now = new Date();
  const cases = fs.existsSync(dataPath)
    ? JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    : [];

  const overdue = cases.filter(c => {
    if (!c.followUpDate) return false;
    return new Date(c.followUpDate) < now;
  });

  res.json(overdue);
});

// ✅ GET /case/diary/upcoming?within=7 → next X days follow-up
router.get('/upcoming', (req, res) => {
  const days = parseInt(req.query.within) || 7;
  const now = new Date();
  const future = new Date();
  future.setDate(now.getDate() + days);

  const cases = fs.existsSync(dataPath)
    ? JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    : [];

  const upcoming = cases.filter(c => {
    if (!c.followUpDate) return false;
    const follow = new Date(c.followUpDate);
    return follow >= now && follow <= future;
  });

  res.json(upcoming);
});

module.exports = router;
