// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Middleware
app.use(cors());
app.use(express.json());

// 🛣️ Route Imports
const authRoutes      = require('./routes/auth');
const sessionRoutes   = require('./routes/session');
const auditRoutes     = require('./routes/audit');
const backupRoutes    = require('./routes/backup');
const summaryRoutes   = require('./routes/summary');
const diaryRoutes     = require('./routes/diary');      // 🔔 Diary system
const clientRoutes    = require('./routes/clients');
const employeeRoutes  = require('./routes/employees');
const adminRoutes     = require('./routes/admins');
const caseRoutes      = require('./routes/cases');

// 🔗 Mount Routes
app.use('/auth', authRoutes);
app.use('/session', sessionRoutes);
app.use('/audit', auditRoutes);
app.use('/backup', backupRoutes);
app.use('/summary', summaryRoutes);
app.use('/case/diary', diaryRoutes);   // 📅 Follow-up endpoints
app.use('/client', clientRoutes);
app.use('/employee', employeeRoutes);
app.use('/admin', adminRoutes);
app.use('/case', caseRoutes);

// 🧪 Health Check
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
