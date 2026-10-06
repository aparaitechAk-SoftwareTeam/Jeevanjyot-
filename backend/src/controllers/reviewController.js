const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const { isValidObjectId } = require("../utils/validateObjectId");
const { logAuditAction } = require("../utils/auditLogger");

// Helper to generate unique review ID
const generateReviewId = () => {
  return `JJR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

/* ========================================================
   PATIENT ENDPOINTS
======================================================== */

// POST /api/patient/reviews - Submit review for completed appointment
exports.submitPatientReview = async (req, res) => {
  try {
    const { appointmentId, rating, reviewText } = req.body;
    const patientJwt = req.patient;

    if (!patientJwt || !patientJwt.id) {
      return res.status(401).json({
        success: false,
        message: "Patient authentication required.",
      });
    }

    if (!appointmentId || !isValidObjectId(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Valid completed appointment ID is required.",
      });
    }

    // 1. Fetch Patient
    const patient = await Patient.findById(patientJwt.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found.",
      });
    }

    // 2. Fetch Appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment record not found.",
      });
    }

    // 3. Ownership Verification (phone must match)
    if (appointment.phone !== patient.phone) {
      return res.status(403).json({
        success: false,
        message: "You can only review your own appointments.",
      });
    }

    // 4. Status Verification (Must be COMPLETED)
    if (appointment.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed appointments can be reviewed.",
      });
    }

    // 5. Duplicate Check
    const existingReview = await Review.findOne({ appointmentId: appointment._id });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "A review has already been submitted for this appointment.",
      });
    }

    // 6. Rating Validation
    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5.",
      });
    }

    // 7. Review Text Validation & Sanitization
    const text = String(reviewText || "").trim();
    if (!text || text.length < 2 || text.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Review text must be between 2 and 2000 characters.",
      });
    }

    // 8. Create Review with Treatment & Doctor details
    const review = await Review.create({
      reviewId: generateReviewId(),
      patientId: patient._id,
      patientName: patient.name,
      patientPhone: patient.phone,
      appointmentId: appointment._id,
      appointmentBookingId: appointment.bookingId,
      treatmentCare: appointment.care || "Ayurvedic Care",
      doctorName: appointment.doctorName || "Dr. Jeevan Atole",
      appointmentDate: appointment.preferredDate,
      rating: numRating,
      reviewText: text,
      status: "pending",
      isVerified: true,
    });

    return res.status(201).json({
      success: true,
      message: "Thank you. Your review has been submitted and is awaiting approval.",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A review has already been submitted for this appointment.",
      });
    }

    console.error("Submit review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit review.",
    });
  }
};

// GET /api/patient/reviews - Get reviews submitted by logged-in patient
exports.getPatientReviews = async (req, res) => {
  try {
    const patientJwt = req.patient;

    if (!patientJwt || !patientJwt.id) {
      return res.status(401).json({
        success: false,
        message: "Patient authentication required.",
      });
    }

    const reviews = await Review.find({ patientId: patientJwt.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get patient reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient reviews.",
    });
  }
};

/* ========================================================
   ADMIN ENDPOINTS
======================================================== */

// GET /api/admin/reviews - Admin list all reviews with optional status filter
exports.getAdminReviews = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query.status = status;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get admin reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
    });
  }
};

// PATCH /api/admin/reviews/:id/approve - Approve pending review
exports.approveAdminReview = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        approvedAt: new Date(),
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "REVIEW_APPROVED",
      entity: "Review",
      entityId: review._id.toString(),
      metadata: { reviewId: review.reviewId, patientName: review.patientName, rating: review.rating },
    });

    return res.json({
      success: true,
      message: "Review approved successfully.",
      review,
    });
  } catch (error) {
    console.error("Approve review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to approve review.",
    });
  }
};

// PATCH /api/admin/reviews/:id/reject - Reject pending review
exports.rejectAdminReview = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectedAt: new Date(),
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "REVIEW_REJECTED",
      entity: "Review",
      entityId: review._id.toString(),
      metadata: { reviewId: review.reviewId, patientName: review.patientName },
    });

    return res.json({
      success: true,
      message: "Review rejected successfully.",
      review,
    });
  } catch (error) {
    console.error("Reject review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject review.",
    });
  }
};

// PATCH /api/admin/reviews/:id/reply - Add or update Admin/Doctor reply
exports.replyAdminReview = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const rawReply = req.body.adminReply || req.body.reply || req.body.replyText;
    const replyText = String(rawReply || "").trim();

    if (!replyText || replyText.length < 2 || replyText.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Reply text must be between 2 and 2000 characters.",
      });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        adminReply: replyText,
        repliedAt: new Date(),
        repliedBy: req.admin?.email || "Dr. Jeevan Atole",
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "REVIEW_REPLIED",
      entity: "Review",
      entityId: review._id.toString(),
      metadata: { reviewId: review.reviewId, patientName: review.patientName },
    });

    return res.json({
      success: true,
      message: "Reply saved successfully.",
      review,
    });
  } catch (error) {
    console.error("Reply review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save reply.",
    });
  }
};

// DELETE /api/admin/reviews/:id - Delete review
exports.deleteAdminReview = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "REVIEW_DELETED",
      entity: "Review",
      entityId: req.params.id,
      metadata: { reviewId: review.reviewId, patientName: review.patientName },
    });

    return res.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete review.",
    });
  }
};

/* ========================================================
   PUBLIC ENDPOINTS
======================================================== */

// GET /api/reviews - Get public approved reviews only
exports.getPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get public reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
    });
  }
};

// GET /api/reviews/summary - Get calculated rating summary from approved reviews
exports.getPublicReviewsSummary = async (req, res) => {
  try {
    const approvedReviews = await Review.find({ status: "approved" }).lean();

    const totalApprovedReviews = approvedReviews.length;
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let ratingSum = 0;

    approvedReviews.forEach((r) => {
      const star = Math.round(r.rating);
      if (ratingDistribution[star] !== undefined) {
        ratingDistribution[star]++;
      }
      ratingSum += r.rating;
    });

    const averageRating =
      totalApprovedReviews > 0
        ? Number((ratingSum / totalApprovedReviews).toFixed(1))
        : 0;

    return res.json({
      success: true,
      summary: {
        averageRating,
        totalApprovedReviews,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("Get review summary error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch review summary.",
    });
  }
};
