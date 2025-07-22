// routes/uiActions.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', (req, res) => {
  const role = req.user.role;

  const baseActions = [
    {
      label: 'Dashboard',
      type: 'button',
      target: '/dashboard',
      method: 'GET'
    },
    {
      label: 'View Diary',
      type: 'button',
      target: '/case/diary?day=' + new Date().toISOString().split('T')[0],
      method: 'GET'
    }
  ];

  const adminActions = [
    {
      label: 'Follow-Up Summary',
      type: 'button',
      target: '/summary/followups?within=7',
      method: 'GET'
    },
    {
      label: 'Audit Session Logs',
      type: 'button',
      target: '/session/logs',
      method: 'GET'
    }
  ];

  const employeeActions = [
    {
      label: 'Submit Case Note',
      type: 'button',
      target: '/case/:id/notes',
      method: 'POST',
      payload: { text: 'New note here' }
    }
  ];

  const actions = [...baseActions];
  if (role === 'admin') actions.push(...adminActions);
  if (role === 'employee') actions.push(...employeeActions);

  res.json({ role, actions });
});

module.exports = router;
