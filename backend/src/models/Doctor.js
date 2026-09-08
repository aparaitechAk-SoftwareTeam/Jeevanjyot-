const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
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
      trim: true,
      maxlength: 20,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
      default: "",
    },

    specialization: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    qualifications: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    experience: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    consultationDays: {
      type: [String],
      default: [],
    },

    consultationStartTime: {
      type: String,
      trim: true,
      default: "",
    },

    consultationEndTime: {
      type: String,
      trim: true,
      default: "",
    },

    imageUrl: {
      type: String,
      trim: true,
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

module.exports = mongoose.model("Doctor", doctorSchema);
