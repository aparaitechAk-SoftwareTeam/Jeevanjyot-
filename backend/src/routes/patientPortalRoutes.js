const express = require("express");
const {
  patientLogin,
  getPatientProfile,
  getPatientAppointments,
  getPatientPrescriptions,
  getPatientReports,
} = require("../controllers/patientPortalController");

const requirePatient = require("../middleware/requirePatient");

const router = express.Router();

// Public login
router.post("/login", patientLogin);

// Protected patient endpoints
router.get("/profile", requirePatient, getPatientProfile);
router.get("/appointments", requirePatient, getPatientAppointments);
router.get("/prescriptions", requirePatient, getPatientPrescriptions);
router.get("/reports", requirePatient, getPatientReports);

module.exports = router;
