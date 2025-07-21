// routes/summary.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// 🔐 Admin-only access
router.use(protect);
router.use(authorizeRole(['admin']));

// 📁 Utility: Count records in a file
function countRecords(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return 0;
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  return Array.isArray(data) ? data.length : 0;
}

// ✅ GET /summary → total record counts
router.get('/', (req, res) => {
  const summary = {
    clients:   countRecords('../data/clients.json'),
    cases:     countRecords('../data/cases.json'),
    employees: countRecords('../data/employees.json'),
    admins:    countRecords('../data/admins.json')
  };

  res.json({
    timestamp: new Date().toISOString(),
    summary
  });
});

// 📊 GET /summary/status → status breakdowns
router.get('/status', (req, res) => {
  const casesPath   = path.join(__dirname, '../data/cases.json');
  const clientsPath = path.join(__dirname, '../data/clients.json');

  const cases   = fs.existsSync(casesPath)   ? JSON.parse(fs.readFileSync(casesPath, 'utf-8'))   : [];
  const clients = fs.existsSync(clientsPath) ? JSON.parse(fs.readFileSync(clientsPath, 'utf-8')) : [];

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

// 📈 GET /summary/deltas → new records in last 7 days
router.get('/deltas', (req, res) => {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - 7); // Look back 7 days

  function loadRecent(pathToFile) {
    const fullPath = path.join(__dirname, pathToFile);
    if (!fs.existsSync(fullPath)) return 0;

    const records = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    return records.filter(item => {
      const dateStr = item.createdAt || item.timestamp || item.date;
      const date = new Date(dateStr);
      return date > threshold;
    }).length;
  }

  const deltas = {
    cases:     loadRecent('../data/cases.json'),
    clients:   loadRecent('../data/clients.json'),
    employees: loadRecent('../data/employees.json')
  };

  res.json({
    timestamp: new Date().toISOString(),
    deltas,
    range: {
      since: threshold.toISOString(),
      interval: 'last 7 days'
    }
  });
});

module.exports = router;
