// middleware/authMiddleware.js

function protect(req, res, next) {
  const role = req.headers['x-user-role'];
  if (!role) {
    return res.status(401).json({ error: 'Role header missing. Not authenticated.' });
  }
  req.user = { role };
  next();
}

function authorizeRole(allowedRoles) {
  return function (req, res, next) {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Access denied. Role not permitted.' });
    }
    next();
  };
}

module.exports = { protect, authorizeRole };
