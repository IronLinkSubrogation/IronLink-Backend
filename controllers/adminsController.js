// controllers/adminsController.js
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/admins.json');

function readAdmins() {
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
}

function writeAdmins(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function getAdmins(req, res) {
  const admins = readAdmins();
  res.json(admins);
}

function getAdminById(req, res) {
  const admins = readAdmins();
  const admin = admins.find(a => a.id === req.params.id);
  if (!admin) return res.status(404).json({ error: 'Admin not found.' });
  res.json(admin);
}

function createAdmin(req, res) {
  const admins = readAdmins();
  const newAdmin = {
    id: Date.now().toString(),
    ...req.body
  };
  admins.push(newAdmin);
  writeAdmins(admins);
  res.status(201).json(newAdmin);
}

function updateAdmin(req, res) {
  const admins = readAdmins();
  const index = admins.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Admin not found.' });

  admins[index] = { ...admins[index], ...req.body };
  writeAdmins(admins);
  res.json(admins[index]);
}

function deleteAdmin(req, res) {
  const admins = readAdmins();
  const index = admins.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Admin not found.' });

  const removed = admins.splice(index, 1)[0];
  writeAdmins(admins);
  res.json(removed);
}

module.exports = {
  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin
};
