const express = require("express");
const rateLimit = require("express-rate-limit");
const { loginAdmin, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many password reset requests. Please try again later.",
  },
});

router.post("/login", loginLimiter, loginAdmin);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", forgotPasswordLimiter, resetPassword);

module.exports = router;

