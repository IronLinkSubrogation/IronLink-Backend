// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Global Middleware
app.use(cors());
app.use(express.json());

// 🔐 Role-based protection now handled via headers ("x-user-role")
// Removed query-based injection

// 📦 Import Route Modules
const authRoutes     = require('./routes/auth');         // Handles login
const clientRoutes   = require('./routes/clients');
const employeeRoutes = require('./routes/employees');
const adminRoutes    = require('./routes/admins');        // Make sure this matches filename
const caseRoutes     = require('./routes/cases');

// 🔗 Mount Routes
app.use('/auth', authRoutes);
app.use('/client', clientRoutes);
app.use('/employee', employeeRoutes);
app.use('/admin', adminRoutes);
app.use('/case', caseRoutes);

// 🧪 Root Health Check
app.get('/', (req, res) => {
  const role = req.headers['x-user-role'];
  res.json({
    message: 'IronLink CRM backend is live',
    role: role || 'guest'
  });
});

// 💥 Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚀 IronLink backend running on port ${PORT}`);
});
