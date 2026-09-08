const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
  {
    treatmentId: {
      type: String,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Ayurveda",
        "Panchakarma",
        "Specialized Care",
        "Wellness",
        "Treatment",
        "Massage",
        "Management",
        "Skin Care",
        "Therapy",
        "Services",
        "Body Care",
        "Surgery",
        "Gender",
        "Amenities",
      ],
      default: "Ayurveda",
    },

    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    duration: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    consultationRequirement: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "Required prior to treatment",
    },

    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },

    displayOrder: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("Treatment", treatmentSchema);
