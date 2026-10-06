const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    care: {
      type: String,
      required: true,
    },

    preferredDate: {
      type: String,
      required: true,
    },

    timeSlot: {
      type: String,
      trim: true,
      default: "10:00 AM - 10:30 AM",
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },

    doctorName: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "rejected"],
      default: "pending",
    },

    cancellationReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate slot booking for same date, timeSlot, doctor and non-cancelled status
appointmentSchema.index(
  { preferredDate: 1, timeSlot: 1, doctorId: 1 },
  { unique: false }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
