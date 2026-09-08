const express = require("express");
const {
  createMedicalRecord,
  getPatientMedicalRecords,
} = require("../controllers/medicalRecordController");

const {
  createPrescription,
  getPatientPrescriptions,
  getAdminPrescriptions,
  renderPrescriptionHTML,
} = require("../controllers/prescriptionController");

const requireAdmin = require("../middleware/requireAdmin");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

/* Medical Records */
router.post(
  "/medical-records",
  requireAdmin,
  checkRole(["SUPER_ADMIN", "DOCTOR"]),
  createMedicalRecord
);

router.get(
  "/medical-records/patient/:patientId",
  requireAdmin,
  checkRole(["SUPER_ADMIN", "DOCTOR"]),
  getPatientMedicalRecords
);

/* Prescriptions */
router.post(
  "/prescriptions",
  requireAdmin,
  checkRole(["SUPER_ADMIN", "DOCTOR"]),
  createPrescription
);

router.get(
  "/prescriptions",
  requireAdmin,
  checkRole(["SUPER_ADMIN", "DOCTOR", "RECEPTIONIST", "MANAGER"]),
  getAdminPrescriptions
);

router.get(
  "/prescriptions/patient/:patientId",
  requireAdmin,
  checkRole(["SUPER_ADMIN", "DOCTOR", "RECEPTIONIST", "MANAGER"]),
  getPatientPrescriptions
);

router.get("/prescriptions/:id/pdf", renderPrescriptionHTML);

module.exports = router;
