// controllers/casesController.js
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/cases.json');

function readCases() {
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
}

function writeCases(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function getCases(req, res) {
  const cases = readCases();
  res.json(cases);
}

function getCaseById(req, res) {
  const cases = readCases();
  const found = cases.find(c => c.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Case not found.' });
  res.json(found);
}

function createCase(req, res) {
  const cases = readCases();
  const newCase = {
    id: Date.now().toString(),
    ...req.body
  };
  cases.push(newCase);
  writeCases(cases);
  res.status
