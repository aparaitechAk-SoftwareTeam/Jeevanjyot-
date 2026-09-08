const mongoose = require("mongoose");

const clinicHolidaySchema = new mongoose.Schema(
  {
    holidayId: {
      type: String,
      unique: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
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

module.exports = mongoose.model("ClinicHoliday", clinicHolidaySchema);
