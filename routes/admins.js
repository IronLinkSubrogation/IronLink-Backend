// routes/admins.js
const express = require('express');
const router = express.Router();
const {
  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin
} = require('../controllers/adminsController');

const { protect, authorizeRole } = require('../middleware/authMiddleware');

// Restrict admin actions to admin role only
router.use(protect);
router.use(authorizeRole(['admin']));

router.get('/', getAdmins);
router.get('/:id', getAdminById);
router.post('/', createAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;
