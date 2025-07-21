const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Middleware
app.use(cors());
app.use(express.json());

// 🛣️ Route Imports
const authRoutes                    = require('./routes/auth');
const sessionRoutes                 = require('./routes/session');
const sessionLogsRoutes             = require('./routes/sessionLogs');
const auditRoutes                   = require('./routes/audit');
const backupRoutes                  = require('./routes/backup');

const summaryRoutes                 = require('./routes/summary');
const summaryFollowupsRoutes        = require('./routes/summaryFollowups');
const summaryFollowupsStatusRoutes  = require('./routes/summaryFollowupsStatus');

const diaryRoutes                   = require('./routes/diary');
const caseRoutes                    = require('./routes/cases');

const clientRoutes                  = require('./routes/clients');
const employeeRoutes                = require('./routes/employees');
const adminRoutes                   = require('./routes/admins');

const uiActionsRoutes               = require('./routes/uiActions');
const uiCaseActionsRoutes           = require('./routes/uiCaseActions');

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
app.use('/case', caseRoutes);

app.use('/client', clientRoutes);
app.use('/employee', employeeRoutes);
app.use('/admin', adminRoutes);

app.use('/ui/actions', uiActionsRoutes);
app.use('/ui/case-actions', uiCaseActionsRoutes);

// 🧪 Health Check
app.get('/', (req, res) => {
  const role = req.headers['x-user-role'];
  res.json({
    message: 'IronLink CRM backend is live',
    role: role || 'guest'
  });
});

// 💥 Error Handling
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚀 IronLink backend running on port ${PORT}`);
});
