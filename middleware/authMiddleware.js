// middleware/authMiddleware.js

/**
 * Middleware to simulate user authentication.
 * Assumes req.user is injected earlier (e.g. via ?role=admin in query).
 */
function protect(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated." });
  }
  next();
}

/**
 * Middleware factory for role-based access control.
 * Usage: authorizeRole(['admin', 'employee'])
 */
function authorizeRole(allowedRoles) {
  return function (req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied." });
    }
    next();
  };
}

module.exports = { protect, authorizeRole };
