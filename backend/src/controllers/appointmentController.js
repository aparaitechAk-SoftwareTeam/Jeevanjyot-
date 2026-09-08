const Appointment = require("../models/Appointment");
const ClinicHoliday = require("../models/ClinicHoliday");
const Doctor = require("../models/Doctor");
const Notification = require("../models/Notification");
const { logAuditAction } = require("../utils/auditLogger");

const STANDARD_SLOTS = [
  "09:00 AM - 09:30 AM",
  "09:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "04:00 PM - 04:30 PM",
  "04:30 PM - 05:00 PM",
  "05:00 PM - 05:30 PM",
  "05:30 PM - 06:00 PM",
  "06:00 PM - 06:30 PM",
  "06:30 PM - 07:00 PM",
];

const generateBookingId = () => {
  return `JJC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

// GET /api/appointments/available-slots?date=YYYY-MM-DD&doctorId=...
const getAvailableSlots = async (req, res) => {
  try {
    const { date, doctorId } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required.",
      });
    }

    // Check if date is in the past
    const todayStr = new Date().toISOString().split("T")[0];
    if (date < todayStr) {
      return res.status(400).json({
        success: false,
        message: "Cannot check availability for past dates.",
        availableSlots: [],
      });
    }

    // Check if clinic is on holiday on this date
    const holiday = await ClinicHoliday.findOne({ date, isActive: true });
    if (holiday) {
      return res.json({
        success: true,
        isHoliday: true,
        holidayReason: holiday.reason,
        availableSlots: [],
      });
    }

    // Find booked slots for this date (and doctor if provided)
    const query = {
      preferredDate: date,
      status: { $in: ["pending", "confirmed"] },
    };

    if (doctorId) {
      query.doctorId = doctorId;
    }

    const bookedAppointments = await Appointment.find(query).select("timeSlot").lean();
    const bookedTimeSlots = new Set(bookedAppointments.map((a) => a.timeSlot));

    const availableSlots = STANDARD_SLOTS.map((slot) => ({
      slot,
      isAvailable: !bookedTimeSlots.has(slot),
    }));

    return res.json({
      success: true,
      isHoliday: false,
      date,
      availableSlots,
    });
  } catch (error) {
    console.error("Get available slots error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to calculate available slots.",
    });
  }
};

// POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const {
      patientName,
      phone,
      email,
      care,
      preferredDate,
      timeSlot,
      doctorId,
      message,
    } = req.body;

    if (!patientName || !phone || !care || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required appointment details (Name, Phone, Care, Date).",
      });
    }

    // 1. Past Date Rejection
    const todayStr = new Date().toISOString().split("T")[0];
    if (preferredDate < todayStr) {
      return res.status(400).json({
        success: false,
        message: "Appointment date cannot be in the past.",
      });
    }

    // 2. Invalid Slot Rejection
    const slotToBook = timeSlot || "10:00 AM - 10:30 AM";
    if (!STANDARD_SLOTS.includes(slotToBook)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time slot selected.",
      });
    }

    // 3. Clinic Holiday Check
    const holiday = await ClinicHoliday.findOne({ date: preferredDate, isActive: true });
    if (holiday) {
      return res.status(400).json({
        success: false,
        message: `The clinic is closed on ${preferredDate} due to: ${holiday.reason}. Please select another date.`,
      });
    }

    // 4. Duplicate Slot Collision Check (Server-Side Enforcement)
    const collisionQuery = {
      preferredDate,
      timeSlot: slotToBook,
      status: { $in: ["pending", "confirmed"] },
    };

    if (doctorId) {
      collisionQuery.doctorId = doctorId;
    }

    const existing = await Appointment.findOne(collisionQuery);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "The selected time slot is already reserved. Please choose another time slot.",
      });
    }

    let doctorName = "";
    if (doctorId) {
      const doc = await Doctor.findById(doctorId).select("name");
      if (doc) doctorName = doc.name;
    }

    const bookingId = generateBookingId();

    const appointment = await Appointment.create({
      bookingId,
      patientName,
      phone,
      email: email || "",
      care,
      preferredDate,
      timeSlot: slotToBook,
      doctorId: doctorId || null,
      doctorName,
      message: message || "",
    });

    // Auto-upsert Patient record in Patients collection
    try {
      const Patient = require("../models/Patient");
      const existingPatient = await Patient.findOne({ phone: phone.trim() });
      if (!existingPatient) {
        const patientId = `JJP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        await Patient.create({
          patientId,
          name: patientName.trim(),
          phone: phone.trim(),
          email: email ? email.trim().toLowerCase() : "",
          notes: `Created automatically from appointment booking (${bookingId}).`,
        });
      }
    } catch (patientErr) {
      console.error("Auto-create patient error:", patientErr);
    }

    await logAuditAction({
      userId: "PublicUser",
      userName: patientName,
      userRole: "PATIENT",
      action: "BOOK_APPOINTMENT",
      entity: "Appointment",
      entityId: appointment._id.toString(),
      metadata: { bookingId: appointment.bookingId, preferredDate, timeSlot: slotToBook },
    });

    // Create Notification record for clinic admin/patient
    const { isEmailConfigured, sendGenericEmail } = require("../utils/emailService");
    const notificationId = `NOTIF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const emailConfigured = isEmailConfigured();
    const whatsappConfigured = Boolean(process.env.WHATSAPP_API_KEY || process.env.TWILIO_SID);
    const hasProvider = email ? emailConfigured : whatsappConfigured;

    let initialStatus = hasProvider ? "pending" : "not_configured";
    let initialError = hasProvider ? "" : "Email/WhatsApp delivery provider credentials not configured in environment.";

    const notifRecord = await Notification.create({
      notificationId,
      recipientType: "patient",
      recipientName: patientName,
      phone,
      email: email || "",
      appointmentId: appointment._id,
      type: "Appointment Confirmation",
      channel: email ? "Email" : "WhatsApp",
      subject: `Appointment Booking Confirmation - ${appointment.bookingId}`,
      message: `Dear ${patientName}, your appointment request (${appointment.bookingId}) for ${preferredDate} at ${slotToBook} has been received.`,
      status: initialStatus,
      errorMessage: initialError,
    });

    if (email && emailConfigured) {
      sendGenericEmail({
        to: email,
        subject: `Appointment Booking Confirmation - ${appointment.bookingId}`,
        html: `<p>Dear ${patientName},</p><p>Your appointment request (<strong>${appointment.bookingId}</strong>) for <strong>${preferredDate}</strong> at <strong>${slotToBook}</strong> has been successfully received.</p><p>Thank you for choosing Jeevanjyot Nature Cure Ayurvedic Clinic.</p>`,
        text: `Dear ${patientName}, your appointment request (${appointment.bookingId}) for ${preferredDate} at ${slotToBook} has been received.`,
      }).then(async (result) => {
        if (result.success) {
          notifRecord.status = "sent";
          notifRecord.sentAt = new Date();
          notifRecord.errorMessage = "";
        } else {
          notifRecord.status = "failed";
          notifRecord.errorMessage = typeof result.error === "object" ? JSON.stringify(result.error) : String(result.error);
        }
        await notifRecord.save();
      }).catch((err) => {
        console.error("Async appointment notification error:", err);
      });
    }

    return res.status(201).json({
      success: true,
      message: "Appointment request received successfully.",
      appointment: {
        bookingId: appointment.bookingId,
        patientName: appointment.patientName,
        phone: appointment.phone,
        care: appointment.care,
        preferredDate: appointment.preferredDate,
        timeSlot: appointment.timeSlot,
        doctorName: appointment.doctorName,
        status: appointment.status,
      },
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create appointment request.",
    });
  }
};

// GET /api/appointments (Admin protected)
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch appointments.",
    });
  }
};

// GET /api/appointments/lookup?bookingId=... OR ?phone=... (Public patient lookup)
const lookupAppointment = async (req, res) => {
  try {
    const { bookingId, phone } = req.query;

    if (!bookingId && !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide bookingId or phone number to look up appointments.",
      });
    }

    const query = {};
    if (bookingId) query.bookingId = bookingId.trim();
    if (phone) query.phone = phone.trim();

    const appointments = await Appointment.find(query).sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Lookup appointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to find appointments.",
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAvailableSlots,
  lookupAppointment,
};
