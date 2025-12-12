// middlewares/permissions.js

/**
 * requireRole('admin') - allows only role name 'admin'
 * requirePermission('leads:create') - checks user.hasPermission('leads:create')
 */
export const requireRole = (roleName) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Auth required" });
  if (req.user.role !== roleName) return res.status(403).json({ message: "Forbidden" });
  next();
};

export const requirePermission = (permissionKey) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Auth required" });
  if (typeof req.user.hasPermission !== "function") {
    // fallback: check scopes or role
    if (req.user.scopes && req.user.scopes.includes(permissionKey)) return next();
    if (req.user.role === "admin") return next();
    return res.status(403).json({ message: "Forbidden" });
  }
  if (!req.user.hasPermission(permissionKey)) return res.status(403).json({ message: "Forbidden" });
  next();
};
