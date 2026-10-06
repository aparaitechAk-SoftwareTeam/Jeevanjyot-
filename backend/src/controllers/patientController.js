const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const { isValidObjectId } = require("../utils/validateObjectId");
const { logAuditAction } = require("../utils/auditLogger");

const generatePatientId = () => {
  return `JJP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

// GET /api/admin/patients
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      patients,
    });
  } catch (error) {
    console.error("Get patients error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch patients.",
    });
  }
};

// GET /api/admin/patients/:id
const getPatientById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Patient ID." });
    }

    const patient = await Patient.findById(req.params.id).lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const appointments = await Appointment.find({
      phone: patient.phone,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      patient,
      appointments,
    });
  } catch (error) {
    console.error("Get patient error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient details.",
    });
  }
};

// POST /api/admin/patients
const createPatient = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      dateOfBirth,
      gender,
      address,
      notes,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Patient name and phone number are required.",
      });
    }

    const patient = await Patient.create({
      patientId: generatePatientId(),
      name,
      phone,
      email: email || "",
      dateOfBirth: dateOfBirth || null,
      gender: gender ? gender.toLowerCase() : "",
      address: address || "",
      notes: notes || "",
    });

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "CREATE_PATIENT",
      entity: "Patient",
      entityId: patient._id.toString(),
      metadata: { patientId: patient.patientId, name: patient.name },
    });

    return res.status(201).json({
      success: true,
      message: "Patient created successfully.",
      patient,
    });
  } catch (error) {
    console.error("Create patient error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create patient.",
    });
  }
};

// PATCH /api/admin/patients/:id
const updatePatient = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Patient ID." });
    }

    const allowedFields = [
      "name",
      "phone",
      "email",
      "dateOfBirth",
      "gender",
      "address",
      "notes",
      "isActive",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = field === "gender" && req.body[field] ? req.body[field].toLowerCase() : req.body[field];
      }
    });

    if (updates.name !== undefined && !updates.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Patient name cannot be empty.",
      });
    }

    if (updates.phone !== undefined && !updates.phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number cannot be empty.",
      });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "UPDATE_PATIENT",
      entity: "Patient",
      entityId: patient._id.toString(),
      metadata: { patientId: patient.patientId, name: patient.name },
    });

    return res.json({
      success: true,
      message: "Patient updated successfully.",
      patient,
    });
  } catch (error) {
    console.error("Update patient error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update patient.",
    });
  }
};

// DELETE /api/admin/patients/:id
const deletePatient = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Patient ID." });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "DEACTIVATE_PATIENT",
      entity: "Patient",
      entityId: patient._id.toString(),
      metadata: { patientId: patient.patientId, name: patient.name },
    });

    return res.json({
      success: true,
      message: "Patient deactivated successfully.",
    });
  } catch (error) {
    console.error("Delete patient error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete patient.",
    });
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
