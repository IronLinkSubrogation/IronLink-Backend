// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Apply global middleware
app.use(cors());
app.use(express.json());

// Simulate user roles via query string (e.g., ?role=admin)
app.use((req, res, next) => {
  const role = req.query.role;
  if (role) {
    req.user = { role };
  }
  next();
});

// Import route modules
const clientRoutes = require('./routes/clients');
const employeeRoutes = require('./routes/employees');
const adminRoutes = require('./routes/admins');
const caseRoutes = require('./routes/cases');

// Wire routes
app.use('/client', clientRoutes);
app.use('/employee', employeeRoutes);
app.use('/admin', adminRoutes);
app.use('/case', caseRoutes);

// Health check / root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'IronLink CRM backend is live',
    role: req.user?.role || 'guest'
  });
});

// Launch server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
