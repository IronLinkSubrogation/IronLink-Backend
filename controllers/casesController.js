// controllers/casesController.js
const fs = require('fs');
const path = require('path');
const { logActivity } = require('../utils/logger');

const dataPath = path.join(__dirname, '../data/cases.json');

// ✅ Load all cases
function readCases() {
  if (!fs.existsSync(dataPath)) return [];
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

// ✅ Save updated case list
function writeCases(cases) {
  fs.writeFileSync(dataPath, JSON.stringify(cases, null, 2));
}

// ✅ Create new case
function createCase(req, res) {
  const cases = readCases();

  const newCase = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...req.body,
    followUpDate: req.body.followUpDate || null,
    followUpNote: req.body.followUpNote || ''
  };

  cases.push(newCase);
  writeCases(cases);

  logActivity({
    action: 'CREATE_CASE',
    role: req.user?.role || 'unknown',
    endpoint: req.originalUrl
  });

  res.status(201).json(newCase);
}

// ✅ Update existing case
function updateCase(req, res) {
  const { id } = req.params;
  const cases = readCases();
  const index = cases.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Case not found.' });
  }

  cases[index] = {
    ...cases[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  writeCases(cases);

  logActivity({
    action: 'UPDATE_CASE',
    role: req.user?.role || 'unknown',
    endpoint: req.originalUrl
  });

  res.json(cases[index]);
}

// ✅ Delete case by ID
function deleteCase(req, res) {
  const { id } = req.params;
  const cases = readCases();
  const filtered = cases.filter(c => c.id !== id);

  if (filtered.length === cases.length) {
    return res.status(404).json({ error: 'Case not found.' });
  }

  writeCases(filtered);

  logActivity({
    action: 'DELETE_CASE',
    role: req.user?.role || 'unknown',
    endpoint: req.originalUrl
  });

  res.status(204).send();
}

// ✅ Get all cases
function getAllCases(req, res) {
  const cases = readCases();
  res.json(cases);
}

// ✅ Get case by ID
function getCaseById(req, res) {
  const { id } = req.params;
  const cases = readCases();
  const match = cases.find(c => c.id === id);

  if (!match) {
    return res.status(404).json({ error: 'Case not found.' });
  }

  res.json(match);
}

module.exports = {
  createCase,
  updateCase,
  deleteCase,
  getAllCases,
  getCaseById
};
