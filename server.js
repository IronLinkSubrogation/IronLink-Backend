// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Injecting req.user for role simulation (via query param)
app.use((req, res, next) => {
  const role = req.query.role;
  if (role) {
    req.user = { role };
  }
  next();
});

// Routes
const clientRoutes = require('./routes/clients');
app.use('/client', clientRoutes);

// Optional placeholders for other routes
// const adminRoutes = require('./routes/admins');
// const employeeRoutes = require('./routes/employees');
// const caseRoutes = require('./routes/cases');

app.get('/', (req, res) => {
  res.json({ message: 'IronLink Backend Live', role: req.user?.role || 'none' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
