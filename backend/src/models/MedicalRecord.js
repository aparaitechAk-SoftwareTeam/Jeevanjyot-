const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    recordId: {
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
    consultationDate: {
      type: Date,
      default: Date.now,
    },
    symptoms: {
      type: String,
      trim: true,
      default: "",
    },
    diagnosis: {
      type: String,
      trim: true,
      default: "",
    },
    clinicalNotes: {
      type: String,
      trim: true,
      default: "",
    },
    treatmentPlan: {
      type: String,
      trim: true,
      default: "",
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: String,
      default: "Admin Staff",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
