const express = require("express");
const {
  createAppointment,
  getAppointments,
  getAvailableSlots,
  lookupAppointment,
} = require("../controllers/appointmentController");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// Public endpoints
router.post("/", createAppointment);
router.get("/available-slots", getAvailableSlots);
router.get("/lookup", lookupAppointment);

// Protected endpoints
router.get("/", requireAdmin, getAppointments);

module.exports = router;
