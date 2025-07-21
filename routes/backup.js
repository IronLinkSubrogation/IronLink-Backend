// routes/backup.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// 🔐 Restrict access to admin role only
router.use(protect);
router.use(authorizeRole(['admin']));

// ✅ Helper: safely read JSON file
function readJSON(relativePath) {
  const fullPath = path.join(__dirname, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
}

// 📁 Individual export endpoints
router.get('/clients', (req, res) => {
  const file = path.join(__dirname, '../data/clients.json');
  res.download(file, 'clients-backup.json', err => {
    if (err) res.status(500).json({ error: 'Failed to export clients.' });
  });
});

router.get('/cases', (req, res) => {
  const file = path.join(__dirname, '../data/cases.json');
  res.download(file, 'cases-backup.json', err => {
    if (err) res.status(500).json({ error: 'Failed to export cases.' });
  });
});

router.get('/employees', (req, res) => {
  const file = path.join(__dirname, '../data/employees.json');
  res.download(file, 'employees-backup.json', err => {
    if (err) res.status(500).json({ error: 'Failed to export employees.' });
  });
});

router.get('/admins', (req, res) => {
  const file = path.join(__dirname, '../data/admins.json');
  res.download(file, 'admins-backup.json', err => {
    if (err) res.status(500).json({ error: 'Failed to export admins.' });
  });
});

// 🧱 Full structured export: GET /backup/all
router.get('/all', (req, res) => {
  const clients   = readJSON('../data/clients.json')   || [];
  const cases     = readJSON('../data/cases.json')     || [];
  const employees = readJSON('../data/employees.json') || [];
  const admins    = readJSON('../data/admins.json')    || [];

  res.json({
    timestamp: new Date().toISOString(),
    source: 'IronLink CRM',
    records: {
      clients,
      cases,
      employees,
      admins
    }
  });
});

module.exports = router;
