const Treatment = require("../models/Treatment");
const { isValidObjectId } = require("../utils/validateObjectId");
const { logAuditAction } = require("../utils/auditLogger");

const generateTreatmentId = () => {
  return `JJT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

// GET /api/treatments (Public active treatments)
exports.getTreatments = async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    const treatments = await Treatment.find(query).sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      treatments,
    });
  } catch (error) {
    console.error("Get treatments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch treatments",
    });
  }
};

// GET /api/admin/treatments (Admin all treatments including inactive)
exports.getAdminTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find().sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      treatments,
    });
  } catch (error) {
    console.error("Get admin treatments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch treatments for admin",
    });
  }
};

// GET /api/treatments/:id
exports.getTreatmentById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Treatment ID." });
    }

    const treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: "Treatment not found",
      });
    }

    res.json({
      success: true,
      treatment,
    });
  } catch (error) {
    console.error("Get treatment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch treatment",
    });
  }
};

// POST /api/admin/treatments
exports.createTreatment = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      duration,
      consultationRequirement,
      imageUrl,
      displayOrder,
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Treatment name and description are required",
      });
    }

    const treatment = await Treatment.create({
      treatmentId: generateTreatmentId(),
      name,
      category: category || "Ayurveda",
      description,
      duration: duration || "",
      consultationRequirement: consultationRequirement || "Required prior to treatment",
      imageUrl: imageUrl || "",
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
    });

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "CREATE_TREATMENT",
      entity: "Treatment",
      entityId: treatment._id.toString(),
      metadata: { treatmentId: treatment.treatmentId, name: treatment.name },
    });

    res.status(201).json({
      success: true,
      message: "Treatment created successfully",
      treatment,
    });
  } catch (error) {
    console.error("Create treatment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create treatment",
    });
  }
};

// PATCH /api/admin/treatments/:id
exports.updateTreatment = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Treatment ID." });
    }

    const allowedFields = [
      "name",
      "category",
      "description",
      "duration",
      "consultationRequirement",
      "imageUrl",
      "displayOrder",
      "isActive",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const treatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: "Treatment not found",
      });
    }

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "UPDATE_TREATMENT",
      entity: "Treatment",
      entityId: treatment._id.toString(),
      metadata: { treatmentId: treatment.treatmentId, name: treatment.name },
    });

    res.json({
      success: true,
      message: "Treatment updated successfully",
      treatment,
    });
  } catch (error) {
    console.error("Update treatment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update treatment",
    });
  }
};

// DELETE /api/admin/treatments/:id (Soft delete/deactivate)
exports.deactivateTreatment = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Treatment ID." });
    }

    const treatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: "Treatment not found",
      });
    }

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "ADMIN",
      action: "DEACTIVATE_TREATMENT",
      entity: "Treatment",
      entityId: treatment._id.toString(),
      metadata: { treatmentId: treatment.treatmentId, name: treatment.name },
    });

    res.json({
      success: true,
      message: "Treatment deactivated successfully",
      treatment,
    });
  } catch (error) {
    console.error("Deactivate treatment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate treatment",
    });
  }
};
