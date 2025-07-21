// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Global Middleware
app.use(cors());
app.use(express.json());

// 🛣️ Route Imports
const authRoutes                    = require('./routes/auth');                   // login
const sessionRoutes                 = require('./routes/session');                // role introspection
const sessionLogsRoutes             = require('./routes/sessionLogs');            // session event logs
const auditRoutes                   = require('./routes/audit');                  // activity logs
const backupRoutes                  = require('./routes/backup');                 // data exports
const summaryRoutes                 = require('./routes/summary');                // counts, status, deltas
const summaryFollowupsRoutes        = require('./routes/summaryFollowups');       // diary summary
const summaryFollowupsStatusRoutes  = require('./routes/summaryFollowupsStatus'); // follow-up breakdown by status
const diaryRoutes                   = require('./routes/diary');                  // case follow-up logic
const caseNotesRoutes               = require('./routes/caseNotes');              // per-case notes trail

const clientRoutes                  = require('./routes/clients');
const employeeRoutes                = require('./routes/employees');
const adminRoutes                   = require('./routes/admins');
const caseRoutes                    = require('./routes/cases');

// 🔗 Mount Routes
app.use('/auth', authRoutes);
app.use('/session', sessionRoutes);
app.use('/session/logs', sessionLogsRoutes);
app.use('/audit', auditRoutes);
app.use('/backup', backupRoutes);
app.use('/summary', summaryRoutes);
app.use('/summary/followups', summaryFollowupsRoutes);
app.use('/summary/followups/status', summaryFollowupsStatusRoutes);
app.use('/case/diary', diaryRoutes);
app.use('/case', caseNotesRoutes); // 📝 Extends /case for notes
app.use('/case', caseRoutes);      // CRUD endpoints
app.use('/client', clientRoutes);
app.use('/employee', employeeRoutes);
app.use('/admin', adminRoutes);

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

// 🚀 Launch Server
app.listen(PORT, () => {
  console.log(`🚀 IronLink backend running on port ${PORT}`);
});
