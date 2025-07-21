// utils/logger.js
const fs = require('fs');
const path = require('path');
const logPath = path.join(__dirname, '../logs/activity.json');

function logActivity({ action, role, endpoint }) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    role,
    endpoint
  };

  const existing = fs.existsSync(logPath)
    ? JSON.parse(fs.readFileSync(logPath))
    : [];

  existing.push(logEntry);

  fs.writeFileSync(logPath, JSON.stringify(existing, null, 2));
}

module.exports = { logActivity };
