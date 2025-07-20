// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json());

// Simulated role injection via query string (?role=admin)
app.use((req, res, next) => {
  const role = req.query.role;
  if (role) {
    req.user = { role };
  }
  next();
});

// Route Modules
const clientRoutes = require('./routes/clients');
const employeeRoutes = require('./routes/employees');
const adminRoutes = require('./routes/admins');
const caseRoutes = require('./routes/cases');

// Route Wiring
app.use('/client', clientRoutes);
app.use('/employee', employeeRoutes);
app.use('/admin', adminRoutes);
app.use('/case', caseRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'IronLink CRM backend is live',
    role: req.user?.role || 'guest'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
