// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simulate user injection via ?role= query string
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'IronLink CRM backend is live', role: req.user?.role || 'guest' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
