// routes/cases.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { protect, authorizeRole } = require('../middleware/authMiddleware');
const filePath = path.join(__dirname, '../data/cases.json');

// 🧱 Utility: Load Cases
function loadCases() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// 🧱 Utility: Save Cases
function saveCases(cases) {
  fs.writeFileSync(filePath, JSON.stringify(cases, null, 2));
}

router.use(protect);

// 🔹 GET /case → All cases
router.get('/', authorizeRole(['admin', 'employee']), (req, res) => {
  const cases = loadCases();
  res.json(cases);
});

// 🔹 GET /case/:id → Single case
router.get('/:id', authorizeRole(['admin', 'employee']), (req, res) => {
  const cases = loadCases();
  const found = cases.find(c => c.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Case not found' });
  res.json(found);
});

// 🔹 POST /case → Create new case
router.post('/', authorizeRole(['admin']), (req, res) => {
  const cases = loadCases();
  const newCase = {
    id: Date.now().toString(),
    ...req.body,
    notes: [],
    createdAt: new Date().toISOString()
  };
  cases.push(newCase);
  saveCases(cases);
  res.status(201).json(newCase);
});

// 🔹 PUT /case/:id → Update case
router.put('/:id', authorizeRole(['admin']), (req, res) => {
  let cases = loadCases();
  const index = cases.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Case not found' });

  cases[index] = { ...cases[index], ...req.body };
  saveCases(cases);
  res.json(cases[index]);
});

// 🔹 DELETE /case/:id → Remove case
router.delete('/:id', authorizeRole(['admin']), (req, res) => {
  const cases = loadCases();
  const filtered = cases.filter(c => c.id !== req.params.id);
  if (filtered.length === cases.length) return res.status(404).json({ error: 'Case not found' });

  saveCases(filtered);
  res.json({ deleted: req.params.id });
});

// 🔹 POST /case/:id/notes → Append note
router.post('/:id/notes', authorizeRole(['admin', 'employee']), (req, res) => {
  const cases = loadCases();
  const index = cases.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Case not found' });

  const note = {
    text: req.body.text || '',
    addedBy: req.user.name || 'unknown',
    timestamp: new Date().toISOString()
  };

  cases[index].notes = cases[index].notes || [];
  cases[index].notes.push(note);

  saveCases(cases);
  res.status(201).json(note);
});

module.exports = router;
