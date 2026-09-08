const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const MedicalDocument = require("../models/MedicalDocument");

const createPatientToken = (patient) => {
  return jwt.sign(
    {
      id: patient._id.toString(),
      patientId: patient.patientId,
      name: patient.name,
      phone: patient.phone,
      role: "patient",
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// POST /api/patient/login (Login using Phone number or Patient ID)
exports.patientLogin = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Please enter your registered mobile number or Patient ID.",
      });
    }

    const queryStr = identifier.trim();

    let patient = await Patient.findOne({
      $or: [{ phone: queryStr }, { patientId: queryStr }],
      isActive: true,
    });

    if (!patient) {
      // Check if there is an appointment with this phone number to auto-register patient profile securely
      const appointment = await Appointment.findOne({ phone: queryStr });
      if (appointment) {
        patient = await Patient.create({
          patientId: `JJP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          name: appointment.patientName,
          phone: appointment.phone,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "No registered patient record or appointment found for this phone number / Patient ID.",
        });
      }
    }

    const token = createPatientToken(patient);

    res.json({
      success: true,
      message: "Patient authentication successful.",
      token,
      patient: {
        id: patient._id,
        patientId: patient.patientId,
        name: patient.name,
        phone: patient.phone,
        email: patient.email,
      },
    });
  } catch (error) {
    console.error("Patient login error:", error);
    res.status(500).json({ success: false, message: "Unable to authenticate patient." });
  }
};

// GET /api/patient/profile
exports.getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.patient.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found." });
    }

    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch profile." });
  }
};

// GET /api/patient/appointments
exports.getPatientAppointments = async (req, res) => {
  try {
    const Review = require("../models/Review");
    const patient = await Patient.findById(req.patient.id);
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found." });

    const appointments = await Appointment.find({ phone: patient.phone })
      .sort({ createdAt: -1 })
      .lean();

    const reviews = await Review.find({ patientId: patient._id }).lean();
    const reviewMap = new Map();
    reviews.forEach((r) => {
      reviewMap.set(r.appointmentId.toString(), r);
    });

    const appointmentsWithReview = appointments.map((a) => {
      const rev = reviewMap.get(a._id.toString());
      return {
        ...a,
        hasReview: Boolean(rev),
        review: rev || null,
      };
    });

    res.json({ success: true, appointments: appointmentsWithReview });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch appointments." });
  }
};

// GET /api/patient/prescriptions
exports.getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.patient.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch prescriptions." });
  }
};

// GET /api/patient/reports
exports.getPatientReports = async (req, res) => {
  try {
    const documents = await MedicalDocument.find({ patientId: req.patient.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch reports." });
  }
};
