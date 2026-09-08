const express = require("express");
const {
  submitPatientReview,
  getPatientReviews,
  getAdminReviews,
  approveAdminReview,
  rejectAdminReview,
  deleteAdminReview,
  replyAdminReview,
  getPublicReviews,
  getPublicReviewsSummary,
} = require("../controllers/reviewController");

const requirePatient = require("../middleware/requirePatient");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

/* Public Review Endpoints */
router.get("/reviews", getPublicReviews);
router.get("/reviews/summary", getPublicReviewsSummary);

/* Protected Patient Review Endpoints */
router.post("/patient/reviews", requirePatient, submitPatientReview);
router.get("/patient/reviews", requirePatient, getPatientReviews);

/* Protected Admin Review Endpoints */
router.get("/admin/reviews", requireAdmin, getAdminReviews);
router.patch("/admin/reviews/:id/approve", requireAdmin, approveAdminReview);
router.patch("/admin/reviews/:id/reject", requireAdmin, rejectAdminReview);
router.patch("/admin/reviews/:id/reply", requireAdmin, replyAdminReview);
router.post("/admin/reviews/:id/reply", requireAdmin, replyAdminReview);
router.put("/admin/reviews/:id/reply", requireAdmin, replyAdminReview);
router.delete("/admin/reviews/:id", requireAdmin, deleteAdminReview);

module.exports = router;
