const Enquiry = require("../models/Enquiry");
const Testimonial = require("../models/Testimonial");
const GalleryItem = require("../models/GalleryItem");
const FAQItem = require("../models/FAQItem");
const Article = require("../models/Article");

/* =========================================
   ENQUIRIES
========================================= */
exports.submitEnquiry = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number and message are required.",
      });
    }

    const enquiryId = `JJE-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const enquiry = await Enquiry.create({
      enquiryId,
      name,
      phone,
      email: email || "",
      subject: subject || "General Enquiry",
      message,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      enquiryId: enquiry.enquiryId,
    });
  } catch (error) {
    console.error("Submit enquiry error:", error);
    res.status(500).json({ success: false, message: "Failed to submit enquiry." });
  }
};

exports.getAdminEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch enquiries." });
  }
};

exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found." });
    }

    res.json({ success: true, message: "Enquiry updated successfully.", enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update enquiry." });
  }
};

/* =========================================
   TESTIMONIALS
========================================= */
exports.getPublicTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch testimonials." });
  }
};

exports.getAdminTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch admin testimonials." });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const { patientName, treatmentName, rating, content, isApproved, displayOrder } = req.body;
    if (!patientName || !content) {
      return res.status(400).json({ success: false, message: "Patient name and content are required." });
    }

    const testimonialId = `JJT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const testimonial = await Testimonial.create({
      testimonialId,
      patientName,
      treatmentName: treatmentName || "Ayurvedic Care",
      rating: rating ? Number(rating) : 5,
      content,
      isApproved: isApproved !== undefined ? isApproved : true,
      displayOrder: displayOrder ? Number(displayOrder) : 0,
    });

    res.status(201).json({ success: true, message: "Testimonial created.", testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create testimonial." });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found." });
    }
    res.json({ success: true, message: "Testimonial updated.", testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update testimonial." });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Testimonial deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete testimonial." });
  }
};

/* =========================================
   GALLERY
========================================= */
exports.getPublicGallery = async (req, res) => {
  try {
    const gallery = await GalleryItem.find({ isPublished: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch gallery items." });
  }
};

exports.getAdminGallery = async (req, res) => {
  try {
    const gallery = await GalleryItem.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch admin gallery." });
  }
};

exports.createGalleryItem = async (req, res) => {
  try {
    const { title, category, imageUrl, displayOrder, isPublished } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ success: false, message: "Title and Image URL are required." });
    }

    const itemId = `JJG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const item = await GalleryItem.create({
      itemId,
      title,
      category: category || "Clinic & Therapies",
      imageUrl,
      displayOrder: displayOrder ? Number(displayOrder) : 0,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json({ success: true, message: "Gallery item created.", item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create gallery item." });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "Gallery item updated.", item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update gallery item." });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Gallery item deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete gallery item." });
  }
};

/* =========================================
   FAQS
========================================= */
exports.getPublicFAQs = async (req, res) => {
  try {
    const faqs = await FAQItem.find({ isPublished: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch FAQs." });
  }
};

exports.getAdminFAQs = async (req, res) => {
  try {
    const faqs = await FAQItem.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch admin FAQs." });
  }
};

exports.createFAQ = async (req, res) => {
  try {
    const { question, answer, category, displayOrder, isPublished } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: "Question and answer are required." });
    }

    const faqId = `JJF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const faq = await FAQItem.create({
      faqId,
      question,
      answer,
      category: category || "General",
      displayOrder: displayOrder ? Number(displayOrder) : 0,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json({ success: true, message: "FAQ created.", faq });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create FAQ." });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "FAQ updated.", faq });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update FAQ." });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    await FAQItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "FAQ deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete FAQ." });
  }
};

/* =========================================
   KNOWLEDGE CENTER / ARTICLES
========================================= */
exports.getPublicArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: "published" })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, articles });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch articles." });
  }
};

exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found." });
    }
    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch article." });
  }
};

exports.getAdminArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, articles });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch admin articles." });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, slug, category, content, excerpt, featuredImage, author, status, seoTitle, metaDescription } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required." });
    }

    const generatedSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const articleId = `JJA-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const article = await Article.create({
      articleId,
      title,
      slug: generatedSlug,
      category: category || "Ayurveda & Health",
      content,
      excerpt: excerpt || title,
      featuredImage: featuredImage || "",
      author: author || "Dr. Jeevan Atole",
      status: status || "draft",
      seoTitle: seoTitle || title,
      metaDescription: metaDescription || excerpt || title,
    });

    res.status(201).json({ success: true, message: "Article created.", article });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create article." });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "Article updated.", article });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update article." });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Article deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete article." });
  }
};
