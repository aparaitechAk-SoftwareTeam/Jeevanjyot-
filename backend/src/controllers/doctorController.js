const Doctor = require("../models/Doctor");

const generateDoctorId = () => {
  return `JJD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

// Get all active doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("Get doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor",
    });
  }
};

// Create doctor
exports.createDoctor = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      specialization,
      qualifications,
      experience,
      bio,
      consultationDays,
      consultationStartTime,
      consultationEndTime,
      imageUrl,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Doctor name is required",
      });
    }

    const doctor = await Doctor.create({
      doctorId: generateDoctorId(),
      name,
      phone,
      email,
      specialization,
      qualifications,
      experience,
      bio,
      consultationDays,
      consultationStartTime,
      consultationEndTime,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error) {
    console.error("Create doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create doctor",
      error: error.message,
    });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "email",
      "specialization",
      "qualifications",
      "experience",
      "bio",
      "consultationDays",
      "consultationStartTime",
      "consultationEndTime",
      "imageUrl",
      "isActive",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.json({
      success: true,
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    console.error("Update doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update doctor",
      error: error.message,
    });
  }
};

// Soft delete / deactivate doctor
exports.deactivateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.json({
      success: true,
      message: "Doctor deactivated successfully",
      doctor,
    });
  } catch (error) {
    console.error("Deactivate doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate doctor",
    });
  }
};
