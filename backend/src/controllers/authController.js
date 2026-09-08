const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { isEmailConfigured, sendPasswordResetEmail } = require("../utils/emailService");

const createToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id.toString(),
      role: admin.role,
      email: admin.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
      isActive: true,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = createToken(admin);

    return res.json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Admin email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail, isActive: true });

    const genericSuccessMsg =
      "If an account exists with this email, a password reset link has been sent.";

    if (!admin) {
      return res.json({
        success: true,
        message: genericSuccessMsg,
      });
    }

    // Generate cryptographically secure random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing in MongoDB
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Expire in 20 minutes
    admin.passwordResetTokenHash = resetTokenHash;
    admin.passwordResetExpires = new Date(Date.now() + 20 * 60 * 1000);
    await admin.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/admin/reset-password?token=${resetToken}`;

    console.log(`[AUTH] Admin password reset requested for ${admin.email}`);
    console.log(`[AUTH DEV RESET LINK] ${resetUrl}`);

    // Check if real email service is configured
    if (!isEmailConfigured()) {
      return res.status(400).json({
        success: false,
        configured: false,
        message:
          "Email delivery service is not configured on this server. Please populate SMTP or Brevo credentials in environment.",
      });
    }

    // Send real email via configured provider
    const emailResult = await sendPasswordResetEmail({
      to: admin.email,
      adminName: admin.name || "Admin",
      resetUrl,
    });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send password reset email. Please contact server administrator.",
      });
    }

    return res.json({
      success: true,
      message: genericSuccessMsg,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Hash token to look up in DB
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const admin = await Admin.findOne({
      passwordResetTokenHash: resetTokenHash,
      passwordResetExpires: { $gt: new Date() },
      isActive: true,
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token.",
      });
    }

    // Hash new password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    admin.passwordHash = passwordHash;
    admin.passwordResetTokenHash = null;
    admin.passwordResetExpires = null;
    await admin.save();

    return res.json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to reset password.",
    });
  }
};

module.exports = { loginAdmin, forgotPassword, resetPassword };

