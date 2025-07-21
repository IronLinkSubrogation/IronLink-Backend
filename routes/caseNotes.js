// routes/caseNotes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');
const { logActivity } = require('../utils/logger');

const casePath = path.join(__dirname, '../data/cases.json');

router.use(protect);
router.use(authorizeRole(['admin', 'employee'])); // Only team roles can add notes

// ✅ POST /case/:id/notes — Append note to case
router.post('/:id/notes', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid note text.' });
  }

  const cases = fs.existsSync(casePath)
    ? JSON.parse(fs.readFileSync(casePath, 'utf-8'))
    : [];

  const index = cases.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Case not found.' });
  }

  const note = {
    text,
    addedAt: new Date().toISOString()
  };

  cases[index].notes = cases[index].notes || [];
  cases[index].notes.push(note);

  fs.writeFileSync(casePath, JSON.stringify(cases, null, 2));

  logActivity({
    action: 'ADD_NOTE',
    role: req.user?.role,
    endpoint: req.originalUrl
  });

  res.status(201).json(note);
});
