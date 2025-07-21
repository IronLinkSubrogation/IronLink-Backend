const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Core Middleware
app.use(cors());
app.use(express.json());

// 🛣️ Route Imports

// 🔐 Auth & Sessions
const authRoutes            = require('./routes/auth');
const sessionRoutes         = require('./routes/session');
const sessionLogsRoutes     = require('./routes/sessionLogs');

// 🛠️ Admin Operations
const auditRoutes           = require('./routes/audit');
const backupRoutes          = require('./routes/backup');

// 📊 Summary & Dashboard
const summaryRoutes                 = require('./routes/summary');
const summaryFollowupsRoutes        = require('./routes/summaryFollowups');
const summaryFollowupsStatusRoutes  = require('./routes/summaryFollowupsStatus');
const uiSummaryDashboardRoutes      = require('./routes/uiSummaryDashboard');

// 📁 Case Management
const caseRoutes            = require('./routes/cases');
const diaryRoutes           = require('./routes/diary');

// 👥 Role-Based Entities
const clientRoutes          = require('./routes/clients');
const employeeRoutes        = require('./routes/employees');
const adminRoutes           = require('./routes/admins');

// 🧩 UI Actions
const uiActionsRoutes       = require('./routes/uiActions');
const uiCaseActionsRoutes   = require('./routes/uiCaseActions');

// 🔗 Mount Routes

// Auth & Session
app.use('/auth', authRoutes);
app.use('/session', sessionRoutes);
app.use('/session/logs', sessionLogsRoutes);

// Admin Tools
app.use('/audit', auditRoutes);
app.use('/backup', backupRoutes);

// Summary Dashboard
app.use('/summary', summaryRoutes);
app.use('/summary/followups', summaryFollowupsRoutes);
app.use('/summary/followups/status', summaryFollowupsStatusRoutes);
app.use('/summary/dashboard', uiSummaryDashboardRoutes);

// Case Logic
app.use('/case', caseRoutes);
app.use('/case/diary', diaryRoutes);

// Role Entities
app.use('/client', clientRoutes);
app.use('/employee', employeeRoutes);
app.use('/admin', adminRoutes);

// UI Routes
app.use('/ui/actions', uiActionsRoutes);
app.use('/ui/case-actions', uiCaseActionsRoutes);

// 🧪 Health Check
app.get('/', (req, res) => {
  const role = req.headers['x-user-role'];
  res.json({
    status: 'OK',
    message: 'IronLink CRM backend is live',
    role: role || 'guest'
  });
});

// 💥 Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

// 🚀 Boot Server
app.listen(PORT, () => {
  console.log(`🚀 IronLink backend running on port ${PORT}`);
});
