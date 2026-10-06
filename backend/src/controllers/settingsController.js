const ClinicSetting = require("../models/ClinicSetting");
const ClinicHoliday = require("../models/ClinicHoliday");
const { isValidObjectId } = require("../utils/validateObjectId");
const { logAuditAction } = require("../utils/auditLogger");

exports.getSettings = async (req, res) => {
  try {
    let settings = await ClinicSetting.findOne({ settingId: "DEFAULT_SETTINGS" }).lean();
    if (!settings) {
      settings = await ClinicSetting.create({ settingId: "DEFAULT_SETTINGS" });
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load clinic settings." });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const {
      clinicName,
      address,
      phone1,
      phone2,
      email,
      googleMapsUrl,
      workingHours,
      appointmentSettings,
      notificationSettings,
    } = req.body;

    let settings = await ClinicSetting.findOne({ settingId: "DEFAULT_SETTINGS" });
    if (!settings) {
      settings = new ClinicSetting({ settingId: "DEFAULT_SETTINGS" });
    }

    if (clinicName !== undefined) settings.clinicName = clinicName;
    if (address !== undefined) settings.address = address;
    if (phone1 !== undefined) settings.phone1 = phone1;
    if (phone2 !== undefined) settings.phone2 = phone2;
    if (email !== undefined) settings.email = email;
    if (googleMapsUrl !== undefined) settings.googleMapsUrl = googleMapsUrl;
    if (workingHours !== undefined && Array.isArray(workingHours)) settings.workingHours = workingHours;
    if (appointmentSettings !== undefined) settings.appointmentSettings = { ...settings.appointmentSettings, ...appointmentSettings };
    if (notificationSettings !== undefined) settings.notificationSettings = { ...settings.notificationSettings, ...notificationSettings };

    await settings.save();

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "UPDATE_CLINIC_SETTINGS",
      entity: "ClinicSetting",
      entityId: settings._id.toString(),
      metadata: { clinicName: settings.clinicName },
    });

    res.json({ success: true, message: "Clinic settings updated successfully.", settings });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ success: false, message: "Failed to update clinic settings." });
  }
};

exports.getHolidays = async (req, res) => {
  try {
    const holidays = await ClinicHoliday.find().sort({ date: 1 }).lean();
    res.json({ success: true, holidays });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch clinic holidays." });
  }
};

exports.createHoliday = async (req, res) => {
  try {
    const { date, reason } = req.body;
    if (!date || !reason) {
      return res.status(400).json({ success: false, message: "Holiday date and reason are required." });
    }

    const existing = await ClinicHoliday.findOne({ date });
    if (existing) {
      return res.status(409).json({ success: false, message: `A clinic holiday is already registered for ${date}.` });
    }

    const holidayId = `HOL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const holiday = await ClinicHoliday.create({
      holidayId,
      date,
      reason,
      isActive: true,
    });

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "CREATE_HOLIDAY",
      entity: "ClinicHoliday",
      entityId: holiday._id.toString(),
      metadata: { date: holiday.date, reason: holiday.reason },
    });

    res.status(201).json({ success: true, message: "Clinic holiday added successfully.", holiday });
  } catch (error) {
    console.error("Create holiday error:", error);
    res.status(500).json({ success: false, message: "Failed to create holiday." });
  }
};

exports.updateHoliday = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Holiday ID." });
    }

    const { date, reason, isActive } = req.body;

    const holiday = await ClinicHoliday.findById(req.params.id);
    if (!holiday) {
      return res.status(404).json({ success: false, message: "Holiday record not found." });
    }

    if (date !== undefined) holiday.date = date;
    if (reason !== undefined) holiday.reason = reason;
    if (isActive !== undefined) holiday.isActive = isActive;

    await holiday.save();

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "UPDATE_HOLIDAY",
      entity: "ClinicHoliday",
      entityId: holiday._id.toString(),
      metadata: { date: holiday.date, isActive: holiday.isActive },
    });

    res.json({ success: true, message: "Holiday updated successfully.", holiday });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update holiday." });
  }
};

exports.deleteHoliday = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Holiday ID." });
    }

    const holiday = await ClinicHoliday.findByIdAndDelete(req.params.id);
    if (!holiday) {
      return res.status(404).json({ success: false, message: "Holiday not found." });
    }

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "DELETE_HOLIDAY",
      entity: "ClinicHoliday",
      entityId: req.params.id,
      metadata: { date: holiday.date },
    });

    res.json({ success: true, message: "Holiday deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete holiday." });
  }
};
