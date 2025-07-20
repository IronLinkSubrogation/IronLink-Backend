// middleware/authMiddleware.js

function protect(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated." });
  }
  next();
}

function authorizeRole(allowedRoles) {
  return function (req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied." });
    }
    next();
  };
}

module.exports = { protect, authorizeRole };
