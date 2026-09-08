const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    testimonialId: {
      type: String,
      unique: true,
      index: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    treatmentName: {
      type: String,
      trim: true,
      default: "Ayurvedic Treatment",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
