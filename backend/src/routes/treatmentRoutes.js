const express = require("express");
const {
  getTreatments,
  getTreatmentById,
  getAdminTreatments,
  createTreatment,
  updateTreatment,
  deactivateTreatment,
} = require("../controllers/treatmentController");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// Public treatment endpoints
router.get("/", getTreatments);
router.get("/:id", getTreatmentById);

// Admin treatment endpoints
router.get("/admin/all", requireAdmin, getAdminTreatments);
router.post("/", requireAdmin, createTreatment);
router.patch("/:id", requireAdmin, updateTreatment);
router.delete("/:id", requireAdmin, deactivateTreatment);

module.exports = router;
