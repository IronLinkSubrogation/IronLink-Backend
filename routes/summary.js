// routes/summary.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// 🔐 Secure with admin-only access
router.use(protect);
router.use(authorizeRole(['admin']));

function countRecords(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return 0;
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  return Array.isArray(data) ? data.length : 0;
}

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

module.exports = router;
