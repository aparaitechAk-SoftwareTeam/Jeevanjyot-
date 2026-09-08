const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");
const { isValidObjectId } = require("../utils/validateObjectId");
const { logAuditAction } = require("../utils/auditLogger");

exports.createPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, doctorName, medicines, generalInstructions, nextFollowUpDate } = req.body;

    if (!patientId || !isValidObjectId(patientId) || !medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid Patient ID and at least one medicine entry are required.",
      });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found." });
    }

    const prescriptionId = `JJ-RX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const prescription = await Prescription.create({
      prescriptionId,
      patientId: patient._id,
      patientName: patient.name,
      phone: patient.phone,
      doctorId: doctorId && isValidObjectId(doctorId) ? doctorId : null,
      doctorName: doctorName || "Dr. Jeevan Atole",
      medicines,
      generalInstructions: generalInstructions || "Follow prescribed diet and warm water routine.",
      nextFollowUpDate: nextFollowUpDate || null,
      createdBy: req.admin?.email || req.admin?.name || "Authorized Doctor",
    });

    await logAuditAction({
      userId: req.admin?.id || "Admin",
      userName: req.admin?.email || "Admin",
      userRole: req.admin?.role || "DOCTOR",
      action: "CREATE_PRESCRIPTION",
      entity: "Prescription",
      entityId: prescription._id.toString(),
      metadata: { patientId: patient._id.toString(), prescriptionId: prescription.prescriptionId },
    });

    res.status(201).json({ success: true, message: "Prescription generated.", prescription });
  } catch (error) {
    console.error("Create prescription error:", error);
    res.status(500).json({ success: false, message: "Failed to generate prescription." });
  }
};

exports.getPatientPrescriptions = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.patientId)) {
      return res.status(400).json({ success: false, message: "Invalid Patient ID." });
    }

    const prescriptions = await Prescription.find({ patientId: req.params.patientId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch prescriptions." });
  }
};

exports.getAdminPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch prescriptions." });
  }
};

exports.renderPrescriptionHTML = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Prescription ID.");
    }

    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).send("Prescription not found.");
    }

    const formattedDate = new Date(prescription.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription ${prescription.prescriptionId}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 40px; color: #17231C; }
          .header { border-bottom: 2px solid #123C2A; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
          .title { font-size: 24px; font-weight: bold; color: #123C2A; }
          .subtitle { font-size: 12px; color: #66736B; }
          .patient-box { background: #F7F3E8; border-radius: 12px; padding: 15px; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #123C2A; color: white; text-align: left; padding: 10px; font-size: 12px; }
          td { border-bottom: 1px solid #ddd; padding: 10px; font-size: 13px; }
          .footer { border-top: 1px solid #ddd; padding-top: 20px; display: flex; justify-content: space-between; margin-top: 50px; }
          .print-btn { background: #123C2A; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; }
          @media print { .print-btn { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">JEEVANJYOT CLINIC</div>
            <div class="subtitle">Nature Cure Ayurvedic Clinic & Panchakarma Centre</div>
            <div class="subtitle">Sinhagad Road, Vithalwadi, Pune | Ph: 9822510456</div>
          </div>
          <div style="text-align: right;">
            <strong>Rx ID: ${prescription.prescriptionId}</strong><br/>
            Date: ${formattedDate}<br/>
            Doctor: ${prescription.doctorName}
          </div>
        </div>

        <div class="patient-box">
          <strong>Patient Name:</strong> ${prescription.patientName} &nbsp;&nbsp;|&nbsp;&nbsp;
          <strong>Phone:</strong> ${prescription.phone || "N/A"}
        </div>

        <button type="button" id="printBtn" class="print-btn" onclick="window.print()">Print / Save PDF</button>

        <h3>Rx - Prescribed Ayurvedic Medicines</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine Name</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Timing</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            ${prescription.medicines
              .map(
                (med, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${med.medicineName}</strong></td>
                <td>${med.dosage}</td>
                <td>${med.frequency}</td>
                <td>${med.timing}</td>
                <td>${med.duration}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        ${
          prescription.generalInstructions
            ? `<div style="margin-top: 20px;"><strong>Diet & General Advice:</strong><p>${prescription.generalInstructions}</p></div>`
            : ""
        }

        <div class="footer">
          <div>
            ${
              prescription.nextFollowUpDate
                ? `<strong>Next Follow-up Date:</strong> ${new Date(
                    prescription.nextFollowUpDate
                  ).toLocaleDateString("en-IN")}`
                : ""
            }
          </div>
          <div style="text-align: right; margin-top: 40px;">
            _______________________<br/>
            <strong>${prescription.doctorName}</strong><br/>
            Authorized Practitioner
          </div>
        </div>

        <script>
          document.addEventListener('DOMContentLoaded', function() {
            var btn = document.getElementById('printBtn');
            if (btn) {
              btn.onclick = function() {
                window.print();
              };
            }
          });
        </script>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).send("Error generating prescription PDF view.");
  }
};
