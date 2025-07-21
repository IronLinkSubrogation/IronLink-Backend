// routes/uiCaseActions.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

const filePath = path.join(__dirname, '../data/cases.json');

router.use(protect);
router.use(authorizeRole(['admin', 'employee']));

// 🔹 GET /ui/case-actions/:id → returns buttons for given case
router.get('/:id', (req, res) => {
  const cases = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    : [];

  const caseItem = cases.find(c => c.id === req.params.id);
  if (!caseItem) return res.status(404).json({ error: 'Case not found' });

  const role = req.user.role;
  const actions = [];

  // Common: View Notes
  actions.push({
    label: 'View Notes',
    type: 'button',
    target: `/case/${caseItem.id}`,
    method: 'GET'
  });

  if (role === 'employee' || role === 'admin') {
    actions.push({
      label: 'Add Note',
      type: 'button',
      target: `/case/${caseItem.id}/notes`,
      method: 'POST',
      payload: { text: '' },
      hint: 'Opens note modal'
    });
  }

  if (role === 'admin') {
    actions.push({
      label: 'Mark Follow-Up Complete',
      type: 'button',
      target: `/case/${caseItem.id}`,
      method: 'PUT',
      payload: { followUpDate: null },
      confirm: true,
      style: 'success'
    });

    actions.push({
      label: 'Assign Employee',
      type: 'button',
      target: `/case/${caseItem.id}`,
      method: 'PUT',
      payload: { assignedTo: '' },
      hint: 'Dropdown of employee names',
      style: 'primary'
    });
  }

  res.json({
    caseId: caseItem.id,
    status: caseItem.status,
    followUpDate: caseItem.followUpDate || null,
    actions
  });
});

module.exports = router;
