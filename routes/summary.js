// routes/summary.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// 🔐 Restrict access to admins only
router.use(protect);
router.use(authorizeRole(['admin']));

// ✅ Helper to count flat-file records
function countRecords(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return 0;
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  return Array.isArray(data) ? data.length : 0;
}

// ✅ GET /summary — total record counts
router.get('/', (req, res) => {
  const counts = {
    clients:   countRecords('../data/clients.json'),
    cases:     countRecords('../data/cases.json'),
    employees: countRecords('../data/employees.json'),
    admins:    countRecords('../data/admins.json')
  };

  res.json({
    timestamp: new Date().toISOString(),
    summary: counts
  });
});

// ✅ GET /summary/status — case & client status breakdowns
router.get('/status', (req, res) => {
  const casePath   = path.join(__dirname, '../data/cases.json');
  const clientPath = path.join(__dirname, '../data/clients.json');

  const cases   = fs.existsSync(casePath)   ? JSON.parse(fs.readFileSync(casePath, 'utf-8')) : [];
  const clients = fs.existsSync(clientPath) ? JSON.parse(fs.readFileSync(clientPath, 'utf-8')) : [];

  const caseStatus = cases.reduce((acc, c) => {
    const status = c.status?.toLowerCase() || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const clientStatus = clients.reduce((acc, c) => {
    const status =
      c.active === true ? 'active' :
      c.active === false ? 'inactive' :
      'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  res.json({
    timestamp: new Date().toISOString(),
    breakdown: {
      caseStatus,
      clientStatus
    }
  });
});

module.exports = router;
