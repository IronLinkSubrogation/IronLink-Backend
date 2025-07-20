// controllers/employeesController.js
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/employees.json');

function readEmployees() {
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
}

function writeEmployees(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function getEmployees(req, res) {
  const employees = readEmployees();
  res.json(employees);
}

function getEmployeeById(req, res) {
  const employees = readEmployees();
  const employee = employees.find(e => e.id === req.params.id);
  if (!employee) return res.status(404).json({ error: 'Employee not found.' });
  res.json(employee);
}

function createEmployee(req, res) {
  const employees = readEmployees();
  const newEmployee = {
    id: Date.now().toString(),
    ...req.body
  };
  employees.push(newEmployee);
  writeEmployees(employees);
  res.status(201).json(newEmployee);
}

function updateEmployee(req, res) {
  const employees = readEmployees();
  const index = employees.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Employee not found.' });

  employees[index] = { ...employees[index], ...req.body };
  writeEmployees(employees);
  res.json(employees[index]);
}

function deleteEmployee(req, res) {
  const employees = readEmployees();
  const index = employees.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Employee not found.' });

  const removed = employees.splice(index, 1)[0];
  writeEmployees(employees);
  res.json(removed);
}

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
