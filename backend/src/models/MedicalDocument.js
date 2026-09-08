const mongoose = require("mongoose");

const medicalDocumentSchema = new mongoose.Schema(
  {
    documentId: {
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    documentType: {
      type: String,
      enum: ["Lab Report", "Scan/X-Ray", "Previous Record", "Prescription Doc", "Other"],
      default: "Lab Report",
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      default: "application/pdf",
    },
    uploadedBy: {
      type: String,
      default: "Clinic Staff",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalDocument", medicalDocumentSchema);
