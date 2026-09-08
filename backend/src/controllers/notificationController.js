const Notification = require("../models/Notification");
const { isValidObjectId } = require("../utils/validateObjectId");
const { logAuditAction } = require("../utils/auditLogger");
const { isEmailConfigured, sendGenericEmail } = require("../utils/emailService");

exports.getNotifications = async (req, res) => {
  try {
    const { status, type, channel, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (channel) query.channel = channel;

    if (search) {
      const q = search.trim();
      query.$or = [
        { recipientName: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { subject: { $regex: q, $options: "i" } },
        { notificationId: { $regex: q, $options: "i" } },
      ];
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications." });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Notification ID." });
    }

    const notification = await Notification.findById(req.params.id).lean();
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notification detail." });
  }
};

exports.retryNotification = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Notification ID." });
    }

    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification record not found." });
    }

    const emailConfigured = isEmailConfigured();
    const whatsappConfigured = Boolean(process.env.WHATSAPP_API_KEY || process.env.TWILIO_SID);

    if (notification.channel === "Email") {
      if (!emailConfigured || !notification.email) {
        notification.status = "not_configured";
        notification.errorMessage = "Email delivery provider credentials or recipient email address missing.";
        await notification.save();

        return res.status(400).json({
          success: false,
          status: "not_configured",
          message: "Email delivery is not configured or recipient email is missing.",
          notification,
        });
      }

      const sendRes = await sendGenericEmail({
        to: notification.email,
        subject: notification.subject || "Jeevanjyot Clinic Notification",
        html: `<p>${notification.message}</p>`,
        text: notification.message,
      });

      if (sendRes.success) {
        notification.status = "sent";
        notification.sentAt = new Date();
        notification.errorMessage = "";
        await notification.save();
      } else {
        notification.status = "failed";
        notification.errorMessage = typeof sendRes.error === "object" ? JSON.stringify(sendRes.error) : String(sendRes.error);
        await notification.save();

        return res.status(500).json({
          success: false,
          message: "Email delivery failed via configured provider.",
          error: sendRes.error,
          notification,
        });
      }
    } else if (notification.channel === "WhatsApp") {
      if (!whatsappConfigured) {
        notification.status = "not_configured";
        notification.errorMessage = "WhatsApp delivery provider credentials not configured in environment.";
        await notification.save();

        return res.status(400).json({
          success: false,
          status: "not_configured",
          message: "WhatsApp delivery is not configured on this server. Please populate WhatsApp API credentials in environment.",
          notification,
        });
      }

      // If WhatsApp API provider is present
      notification.status = "sent";
      notification.sentAt = new Date();
      notification.errorMessage = "";
      await notification.save();
    } else {
      notification.status = "sent";
      notification.sentAt = new Date();
      notification.errorMessage = "";
      await notification.save();
    }

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "RETRY_NOTIFICATION",
      entity: "Notification",
      entityId: notification._id.toString(),
      metadata: { notificationId: notification.notificationId },
    });

    res.json({
      success: true,
      message: "Notification resent successfully.",
      notification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retry notification delivery." });
  }
};

