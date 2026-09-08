const mongoose = require("mongoose");

const workingHourSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    isOpen: { type: Boolean, default: true },
    startTime: { type: String, default: "10:00 AM" },
    endTime: { type: String, default: "09:00 PM" },
  },
  { _id: false }
);

const clinicSettingSchema = new mongoose.Schema(
  {
    settingId: {
      type: String,
      unique: true,
      default: "DEFAULT_SETTINGS",
      index: true,
    },
    clinicName: {
      type: String,
      default: "Jeevanjyot Nature Cure Ayurvedic Clinic & Panchakarma Centre",
      trim: true,
    },
    address: {
      type: String,
      default:
        "Flat No. 5, Survey No. 24, A Wing, Vishrantinagar Society, near HDFC Bank, in front of Ranka Jewellers lane, Sinhagad Road, Vithalwadi, Pune - 411051",
      trim: true,
    },
    phone1: { type: String, default: "9822510456", trim: true },
    phone2: { type: String, default: "9035051086", trim: true },
    email: { type: String, default: "info@jeevanjyotayurveda.com", trim: true },
    googleMapsUrl: {
      type: String,
      default: "https://share.google/yVo3rhuwFaeuZn3pP",
      trim: true,
    },
    workingHours: {
      type: [workingHourSchema],
      default: [
        { day: "Monday", isOpen: true, startTime: "10:00 AM", endTime: "09:00 PM" },
        { day: "Tuesday", isOpen: true, startTime: "10:00 AM", endTime: "09:00 PM" },
        { day: "Wednesday", isOpen: true, startTime: "10:00 AM", endTime: "09:00 PM" },
        { day: "Thursday", isOpen: true, startTime: "10:00 AM", endTime: "09:00 PM" },
        { day: "Friday", isOpen: true, startTime: "10:00 AM", endTime: "09:00 PM" },
        { day: "Saturday", isOpen: true, startTime: "10:00 AM", endTime: "09:00 PM" },
        { day: "Sunday", isOpen: false, startTime: "10:00 AM", endTime: "09:00 PM" },
      ],
    },
    appointmentSettings: {
      slotDurationMinutes: { type: Number, default: 30 },
      advanceBookingDays: { type: Number, default: 30 },
      allowCancellation: { type: Boolean, default: true },
    },
    notificationSettings: {
      emailEnabled: { type: Boolean, default: false },
      whatsappEnabled: { type: Boolean, default: false },
      appointmentReminders: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ClinicSetting", clinicSettingSchema);
