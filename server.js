// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Global Middleware
app.use(cors());
app.use(express.json());

// 🔐 Simulated role injection via query (still active for testing, will be phased out)
app.use((req, res, next) => {
  const role = req.query.role;
  if (role) req.user = { role };
  next();
});

// 🛠️ Route Imports
const authRoutes     = require('./routes/auth');
const clientRoutes   = require('./routes/clients');
const employeeRoutes = require('./routes/employees');
const adminRoutes    = require('./routes/admins');     // or './routes/admin' based on file name
const caseRoutes     = require('./routes/cases');

// 🔗 Route Wiring
app.use('/auth', authRoutes);       // handles login
app.use('/client', clientRoutes);
app.use('/employee', employeeRoutes);
app.use('/admin', adminRoutes);
app.use('/case', caseRoutes);

// 🧪 Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'IronLink CRM backend is live',
    role: req.user?.role || 'guest'
  });
});

// 🔻 Global Error Boundary
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

// 🚀 Server Launch
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
