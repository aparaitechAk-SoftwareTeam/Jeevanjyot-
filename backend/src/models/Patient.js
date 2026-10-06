const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
      default: "",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },

    address: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Patient", patientSchema);
