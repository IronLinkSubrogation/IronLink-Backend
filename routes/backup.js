// routes/backup.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// 🔐 Restrict access to admins only
router.use(protect);
router.use(authorizeRole(['admin']));

// ✅ Individual backup endpoints
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

module.exports = router;
