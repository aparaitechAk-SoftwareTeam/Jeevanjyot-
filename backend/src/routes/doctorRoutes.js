const express = require("express");
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deactivateDoctor,
} = require("../controllers/doctorController");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// Public doctor endpoints
router.get("/", getDoctors);
router.get("/:id", getDoctorById);

// Protected admin doctor endpoints
router.post("/", requireAdmin, createDoctor);
router.patch("/:id", requireAdmin, updateDoctor);
router.delete("/:id", requireAdmin, deactivateDoctor);

module.exports = router;
