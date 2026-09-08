const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userRole = (req.admin.role || "").toUpperCase();

    // Map legacy 'admin' or 'superadmin' to SUPER_ADMIN
    const normalizedRole =
      userRole === "ADMIN" || userRole === "SUPERADMIN" ? "SUPER_ADMIN" : userRole;

    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

    if (!normalizedAllowed.includes(normalizedRole) && normalizedRole !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to perform this action.",
      });
    }

    next();
  };
};

module.exports = checkRole;
