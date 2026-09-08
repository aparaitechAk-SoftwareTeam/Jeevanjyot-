const mongoose = require("mongoose");

const medicineItemSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      trim: true,
      default: "1 tablet / 5ml",
    },
    frequency: {
      type: String,
      trim: true,
      default: "Twice daily",
    },
    timing: {
      type: String,
      enum: ["Before Meals", "After Meals", "With Meals", "At Bedtime", "Anytime"],
      default: "After Meals",
    },
    duration: {
      type: String,
      trim: true,
      default: "7 days",
    },
    instructions: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    prescriptionId: {
      type: String,
      unique: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    doctorName: {
      type: String,
      trim: true,
      default: "Dr. Jeevan Atole",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    medicines: [medicineItemSchema],
    generalInstructions: {
      type: String,
      trim: true,
      default: "Follow prescribed diet and warm water routine.",
    },
    nextFollowUpDate: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: String,
      default: "Authorized Doctor/Staff",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
