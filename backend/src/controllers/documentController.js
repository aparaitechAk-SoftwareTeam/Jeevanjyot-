const MedicalDocument = require("../models/MedicalDocument");
const Patient = require("../models/Patient");
const { isValidObjectId } = require("../utils/validateObjectId");
const { logAuditAction } = require("../utils/auditLogger");

exports.createDocument = async (req, res) => {
  try {
    const { patientId, title, documentType, fileUrl } = req.body;
    if (!patientId || !isValidObjectId(patientId) || !title || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Valid Patient ID, Document Title and File URL are required.",
      });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found." });
    }

    const documentId = `JJDOC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const doc = await MedicalDocument.create({
      documentId,
      patientId: patient._id,
      patientName: patient.name,
      title,
      documentType: documentType || "Lab Report",
      fileUrl,
      uploadedBy: req.admin?.email || req.admin?.name || "Clinic Admin",
    });

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "UPLOAD_DOCUMENT",
      entity: "MedicalDocument",
      entityId: doc._id.toString(),
      metadata: { patientId: patient._id.toString(), documentId: doc.documentId },
    });

    res.status(201).json({ success: true, message: "Document uploaded successfully.", document: doc });
  } catch (error) {
    console.error("Create document error:", error);
    res.status(500).json({ success: false, message: "Failed to upload document." });
  }
};

exports.getAdminDocuments = async (req, res) => {
  try {
    const documents = await MedicalDocument.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch documents." });
  }
};

exports.getPatientDocuments = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.patientId)) {
      return res.status(400).json({ success: false, message: "Invalid Patient ID." });
    }

    const documents = await MedicalDocument.find({ patientId: req.params.patientId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch patient documents." });
  }
};
