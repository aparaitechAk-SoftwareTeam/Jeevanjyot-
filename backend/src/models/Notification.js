const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      unique: true,
      index: true,
    },
    recipientType: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    recipientName: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    type: {
      type: String,
      enum: [
        "Appointment Confirmation",
        "Appointment Cancellation",
        "Appointment Reschedule",
        "Appointment Reminder",
        "New Enquiry",
        "Prescription Available",
        "Report Available",
      ],
      default: "Appointment Confirmation",
    },
    channel: {
      type: String,
      enum: ["Email", "WhatsApp", "System"],
      default: "System",
    },
    subject: {
      type: String,
      default: "",
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["sent", "failed", "pending", "not_configured"],
      default: "not_configured",
    },
    provider: {
      type: String,
      default: "Internal Event Bus",
    },
    errorMessage: {
      type: String,
      default: "",
    },
    sentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
