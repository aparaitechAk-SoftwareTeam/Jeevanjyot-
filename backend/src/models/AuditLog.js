const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    logId: {
      type: String,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      default: "System",
    },
    userName: {
      type: String,
      default: "Admin/System",
    },
    userRole: {
      type: String,
      default: "admin",
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entity: {
      type: String,
      required: true,
    },
    entityId: {
      type: String,
      default: "",
    },
    ipAddress: {
      type: String,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
