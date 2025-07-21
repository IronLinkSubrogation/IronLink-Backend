// controllers/clientsController.js
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/clients.json');

function readClients() {
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
}

function writeClients(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function getClients(req, res) {
  const clients = readClients();
  res.json(clients);
}

function getClientById(req, res) {
  const clients = readClients();
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found.' });
  res.json(client);
}

function createClient(req, res) {
  const clients = readClients();
  const newClient = {
    id: Date.now().toString(),
    ...req.body
  };
  clients.push(newClient);
  writeClients(clients);
  res.status(201).json(newClient);
}

function updateClient(req, res) {
  const clients = readClients();
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Client not found.' });

  clients[index] = { ...clients[index], ...req.body };
  writeClients(clients);
  res.json(clients[index]);
}

function deleteClient(req, res) {
  const clients = readClients();
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Client not found.' });

  const removed = clients.splice(index, 1)[0];
  writeClients(clients);
  res.json(removed);
}

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};
