const MedicalRecord = require("../models/MedicalRecord");
const Patient = require("../models/Patient");
const { isValidObjectId } = require("../utils/validateObjectId");
const { logAuditAction } = require("../utils/auditLogger");

exports.createMedicalRecord = async (req, res) => {
  try {
    const { patientId, doctorId, doctorName, symptoms, diagnosis, clinicalNotes, treatmentPlan, followUpDate } = req.body;

    if (!patientId || !isValidObjectId(patientId)) {
      return res.status(400).json({ success: false, message: "Valid Patient ID is required." });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found." });
    }

    const recordId = `JJMR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const record = await MedicalRecord.create({
      recordId,
      patientId: patient._id,
      patientName: patient.name,
      doctorId: doctorId && isValidObjectId(doctorId) ? doctorId : null,
      doctorName: doctorName || "",
      symptoms: symptoms || "",
      diagnosis: diagnosis || "",
      clinicalNotes: clinicalNotes || "",
      treatmentPlan: treatmentPlan || "",
      followUpDate: followUpDate || null,
      createdBy: req.admin?.email || req.admin?.name || "Doctor Staff",
    });

    // Write audit log
    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "DOCTOR",
      action: "CREATE_MEDICAL_RECORD",
      entity: "MedicalRecord",
      entityId: record._id.toString(),
      metadata: { patientId: patient._id.toString(), recordId: record.recordId },
    });

    res.status(201).json({ success: true, message: "Medical record added.", record });
  } catch (error) {
    console.error("Create medical record error:", error);
    res.status(500).json({ success: false, message: "Failed to create medical record." });
  }
};

exports.getPatientMedicalRecords = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.patientId)) {
      return res.status(400).json({ success: false, message: "Invalid Patient ID." });
    }

    const records = await MedicalRecord.find({ patientId: req.params.patientId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch medical records." });
  }
};
