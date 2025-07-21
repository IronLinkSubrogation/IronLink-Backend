// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Global Middleware
app.use(cors());
app.use(express.json());

// 🛣️ Route Imports
const authRoutes     = require('./routes/auth');        // Login
const sessionRoutes  = require('./routes/session');     // Role introspection
const auditRoutes    = require('./routes/audit');       // Activity logs
const backupRoutes   = require('./routes/backup');      // Data exports
const summaryRoutes  = require('./routes/summary');     // Record counts

const clientRoutes   = require('./routes/clients');
const employeeRoutes = require('./routes/employees');
const adminRoutes    = require('./routes/admins');      // Confirm filename
const caseRoutes     = require('./routes/cases');

// 🔗 Route Wiring
app.use('/auth', authRoutes);
app.use('/session', sessionRoutes);
app.use('/audit', auditRoutes);
app.use('/backup', backupRoutes);
app.use('/summary', summaryRoutes);       // ✅ New dashboard metrics route
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

// 💥 Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚀 IronLink backend running on port ${PORT}`);
});
