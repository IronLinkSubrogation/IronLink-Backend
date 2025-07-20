// routes/employees.js
const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeesController');

const { protect, authorizeRole } = require('../middleware/authMiddleware');

// Only admins can manage employees
router.use(protect);
router.use(authorizeRole(['admin']));

router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
