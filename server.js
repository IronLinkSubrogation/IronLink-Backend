// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Global Middleware
app.use(cors());
app.use(express.json());

// 🛣️ Route Imports
const authRoutes     = require('./routes/auth');       // login endpoint
const sessionRoutes  = require('./routes/session');    // introspection endpoint
const clientRoutes   = require('./routes/clients');
const employeeRoutes = require('./routes/employees');
const adminRoutes    = require('./routes/admins');     // confirm file name matches
const caseRoutes     = require('./routes/cases');

// 🔗 Mount Routes
app.use('/auth', authRoutes);
app.use('/session', sessionRoutes);
app.use('/client', clientRoutes);
app.use('/employee', employeeRoutes);
app.use('/admin', adminRoutes);
app.use('/case', caseRoutes);

// 🧪 Health Check Endpoint
app.get('/', (req, res) => {
  const role = req.headers['x-user-role'];
  res.json({
    message: 'IronLink CRM backend is live',
    role: role || 'guest'
  });
});

// 💥 Global Error Boundary
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚀 IronLink backend running on port ${PORT}`);
});
