// routes/clients.js
const express = require('express');
const router = express.Router();
const {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientsController');

const { protect, authorizeRole } = require('../middleware/authMiddleware');

// Protect and restrict to admin/employee roles
router.use(protect);
router.use(authorizeRole(['admin', 'employee']));

router.get('/', getClients);
router.get('/:id', getClientById);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;
