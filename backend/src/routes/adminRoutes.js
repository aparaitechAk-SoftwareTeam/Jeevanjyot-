const express = require("express");
const Appointment = require("../models/Appointment");
const requireAdmin = require("../middleware/requireAdmin");

const {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deactivateDoctor,
} = require("../controllers/doctorController");

const {
  getAdminTreatments,
  createTreatment,
  updateTreatment,
  deactivateTreatment,
} = require("../controllers/treatmentController");

const { getAnalytics, getAuditLogs } = require("../controllers/analyticsController");
const { getReportsSummary, exportAppointmentsCSV } = require("../controllers/reportsController");
const { getNotifications, getNotificationById, retryNotification } = require("../controllers/notificationController");
const { getSettings, updateSettings, getHolidays, createHoliday, updateHoliday, deleteHoliday } = require("../controllers/settingsController");
const { getAdminReviews, approveAdminReview, rejectAdminReview, deleteAdminReview, replyAdminReview } = require("../controllers/reviewController");
const { forgotPassword, resetPassword } = require("../controllers/authController");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

/* =========================
   PUBLIC ADMIN AUTH
========================= */
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/* =========================
   APPOINTMENTS
========================= */

// Get all appointments
router.get("/appointments", requireAdmin, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get admin appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments.",
    });
  }
});

// Update appointment status
router.patch("/appointments/:id/status", requireAdmin, async (req, res) => {
  try {
    const allowedStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
      "rejected",
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status.",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    return res.json({
      success: true,
      message: "Appointment status updated successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Update appointment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update appointment status.",
    });
  }
});

/* =========================
   PATIENT MANAGEMENT
========================= */

// Get all active patients
router.get("/patients", requireAdmin, getPatients);

// Get single patient + appointment history
router.get("/patients/:id", requireAdmin, getPatientById);

// Create patient
router.post("/patients", requireAdmin, createPatient);

// Update patient
router.patch("/patients/:id", requireAdmin, updatePatient);

// Soft delete patient
router.delete("/patients/:id", requireAdmin, deletePatient);

/* =========================
   DOCTOR MANAGEMENT
========================= */

// Get all active doctors
router.get("/doctors", requireAdmin, getDoctors);

// Get single doctor
router.get("/doctors/:id", requireAdmin, getDoctorById);

// Create doctor
router.post("/doctors", requireAdmin, createDoctor);

// Update doctor
router.patch("/doctors/:id", requireAdmin, updateDoctor);

// Soft delete doctor
router.delete("/doctors/:id", requireAdmin, deactivateDoctor);

/* =========================
   TREATMENT MANAGEMENT
========================= */

// Get all treatments
router.get("/treatments", requireAdmin, getAdminTreatments);

// Create treatment
router.post("/treatments", requireAdmin, createTreatment);

// Update treatment
router.patch("/treatments/:id", requireAdmin, updateTreatment);

// Soft delete treatment
router.delete("/treatments/:id", requireAdmin, deactivateTreatment);

/* =========================
   ANALYTICS & AUDIT LOGS
========================= */
router.get("/analytics", requireAdmin, getAnalytics);
router.get("/audit-logs", requireAdmin, getAuditLogs);

/* =========================
   REPORTS MODULE
========================= */
router.get("/reports/summary", requireAdmin, getReportsSummary);
router.get("/reports/export/csv", requireAdmin, exportAppointmentsCSV);

/* =========================
   NOTIFICATIONS MODULE
========================= */
router.get("/notifications", requireAdmin, getNotifications);
router.get("/notifications/:id", requireAdmin, getNotificationById);
router.post("/notifications/:id/retry", requireAdmin, checkRole(["SUPER_ADMIN", "MANAGER"]), retryNotification);

/* =========================
   CLINIC SETTINGS & HOLIDAYS
========================= */
router.get("/settings", requireAdmin, getSettings);
router.patch("/settings", requireAdmin, checkRole(["SUPER_ADMIN", "MANAGER"]), updateSettings);

router.get("/holidays", requireAdmin, getHolidays);
router.post("/holidays", requireAdmin, checkRole(["SUPER_ADMIN", "MANAGER", "RECEPTIONIST"]), createHoliday);
router.patch("/holidays/:id", requireAdmin, checkRole(["SUPER_ADMIN", "MANAGER", "RECEPTIONIST"]), updateHoliday);
router.delete("/holidays/:id", requireAdmin, checkRole(["SUPER_ADMIN", "MANAGER", "RECEPTIONIST"]), deleteHoliday);

/* =========================
   REVIEWS MODULE
========================= */
router.get("/reviews", requireAdmin, getAdminReviews);
router.patch("/reviews/:id/approve", requireAdmin, approveAdminReview);
router.patch("/reviews/:id/reject", requireAdmin, rejectAdminReview);
router.patch("/reviews/:id/reply", requireAdmin, replyAdminReview);
router.post("/reviews/:id/reply", requireAdmin, replyAdminReview);
router.put("/reviews/:id/reply", requireAdmin, replyAdminReview);
router.delete("/reviews/:id", requireAdmin, deleteAdminReview);

module.exports = router;
