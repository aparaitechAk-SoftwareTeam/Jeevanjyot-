const express = require("express");
const {
  submitEnquiry,
  getAdminEnquiries,
  updateEnquiryStatus,
  getPublicTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getPublicGallery,
  getAdminGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getPublicFAQs,
  getAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getPublicArticles,
  getArticleBySlug,
  getAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/contentController");

const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

/* Public Endpoints */
router.post("/enquiries", submitEnquiry);
router.get("/testimonials", getPublicTestimonials);
router.get("/gallery", getPublicGallery);
router.get("/faqs", getPublicFAQs);
router.get("/articles", getPublicArticles);
router.get("/articles/:slug", getArticleBySlug);

/* Admin Endpoints */
router.get("/admin/enquiries", requireAdmin, getAdminEnquiries);
router.patch("/admin/enquiries/:id", requireAdmin, updateEnquiryStatus);

router.get("/admin/testimonials", requireAdmin, getAdminTestimonials);
router.post("/admin/testimonials", requireAdmin, createTestimonial);
router.patch("/admin/testimonials/:id", requireAdmin, updateTestimonial);
router.delete("/admin/testimonials/:id", requireAdmin, deleteTestimonial);

router.get("/admin/gallery", requireAdmin, getAdminGallery);
router.post("/admin/gallery", requireAdmin, createGalleryItem);
router.patch("/admin/gallery/:id", requireAdmin, updateGalleryItem);
router.delete("/admin/gallery/:id", requireAdmin, deleteGalleryItem);

router.get("/admin/faqs", requireAdmin, getAdminFAQs);
router.post("/admin/faqs", requireAdmin, createFAQ);
router.patch("/admin/faqs/:id", requireAdmin, updateFAQ);
router.delete("/admin/faqs/:id", requireAdmin, deleteFAQ);

router.get("/admin/articles", requireAdmin, getAdminArticles);
router.post("/admin/articles", requireAdmin, createArticle);
router.patch("/admin/articles/:id", requireAdmin, updateArticle);
router.delete("/admin/articles/:id", requireAdmin, deleteArticle);

module.exports = router;
