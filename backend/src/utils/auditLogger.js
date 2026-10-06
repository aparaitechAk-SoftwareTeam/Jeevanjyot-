const AuditLog = require("../models/AuditLog");

exports.logAuditAction = async ({
  userId = "System",
  userName = "Admin/System",
  userRole = "admin",
  action,
  entity,
  entityId = "",
  ipAddress = "",
  metadata = {},
}) => {
  try {
    const logId = `LOG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    await AuditLog.create({
      logId,
      userId,
      userName,
      userRole,
      action,
      entity,
      entityId,
      ipAddress,
      metadata,
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
};
