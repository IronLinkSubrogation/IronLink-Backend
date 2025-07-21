const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');
const { logActivity } = require('../utils/logger');

const casePath = path.join(__dirname, '../data/cases.json');

router.use(protect);
router.use(authorizeRole(['admin', 'employee']));

// POST /case/:id/notes → Add note
router.post('/:id/notes', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing note text.' });

  const cases = JSON.parse(fs.readFileSync(casePath, 'utf-8'));
  const target = cases.find(c => c.id === id);
  if (!target) return res.status(404).json({ error: 'Case not found.' });

  const note = {
    text,
    addedAt: new Date().toISOString()
  };

  target.notes = target.notes || [];
  target.notes.push(note);

  fs.writeFileSync(casePath, JSON.stringify(cases, null, 2));

  logActivity({
    action: 'ADD_NOTE',
    role: req.user?.role,
    endpoint: req.originalUrl
  });

  res.status(201).json(note);
});
