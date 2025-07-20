// middleware/authMiddleware.js

/**
 * Simulated auth middleware.
 * Injects req.user from server.js or test query (?role=admin).
 */
function protect(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated." });
  }
  next();
}

/**
 * Factory for role-based authorization middleware.
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
