const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const Enquiry = require("../models/Enquiry");
const AuditLog = require("../models/AuditLog");

exports.getAnalytics = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0];

    const [
      totalPatients,
      activePatients,
      totalDoctors,
      activeDoctors,
      appointments,
      totalPrescriptions,
      enquiries,
    ] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({ isActive: true }),
      Doctor.countDocuments(),
      Doctor.countDocuments({ isActive: true }),
      Appointment.find().lean(),
      Prescription.countDocuments(),
      Enquiry.find().lean(),
    ]);

    const stats = {
      patients: {
        total: totalPatients,
        active: activePatients,
      },
      doctors: {
        total: totalDoctors,
        active: activeDoctors,
      },
      appointments: {
        total: appointments.length,
        pending: appointments.filter((a) => a.status === "pending").length,
        confirmed: appointments.filter((a) => a.status === "confirmed").length,
        completed: appointments.filter((a) => a.status === "completed").length,
        cancelled: appointments.filter((a) => a.status === "cancelled").length,
        rejected: appointments.filter((a) => a.status === "rejected").length,
        today: appointments.filter((a) => a.preferredDate === todayStr).length,
      },
      prescriptions: {
        total: totalPrescriptions,
      },
      enquiries: {
        total: enquiries.length,
        new: enquiries.filter((e) => e.status === "new").length,
        resolved: enquiries.filter((e) => e.status === "resolved").length,
      },
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to generate analytics." });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).lean();
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch audit logs." });
  }
};
