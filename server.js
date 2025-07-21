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
const auditRoutes    = require('./routes/audit');       // Activity log viewer/export
const backupRoutes   = require('./routes/backup');      // Data export endpoints

const clientRoutes   = require('./routes/clients');
const employeeRoutes = require('./routes/employees');
const adminRoutes    = require('./routes/admins');      // Ensure file is named exactly as imported
const caseRoutes     = require('./routes/cases');

// 🔗 Mount Routes
app.use('/auth', authRoutes);
app.use('/session', sessionRoutes);
app.use('/audit', auditRoutes);
app.use('/backup', backupRoutes);
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
