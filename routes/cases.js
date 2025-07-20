// routes/cases.js
const express = require('express');
const router = express.Router();
const {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase
} = require('../controllers/casesController');

const { protect, authorizeRole } = require('../middleware/authMiddleware');

// All roles can view; only admin/employee can create/update/delete
router.use(protect);

router.get('/', getCases);
router.get('/:id', getCaseById);

router.post('/', authorizeRole(['admin', 'employee']), createCase);
router.put('/:id', authorizeRole(['admin', 'employee']), updateCase);
router.delete('/:id', authorizeRole(['admin', 'employee']), deleteCase);

module.exports = router;
