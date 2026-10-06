const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Treatment = require("../models/Treatment");

function getDateRange(rangeType, startDate, endDate) {
  const now = new Date();
  let start = new Date();
  let end = new Date();

  // Reset hours
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  switch (rangeType) {
    case "today":
      break;
    case "yesterday":
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
      break;
    case "this_week":
      const dayOfWeek = start.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      start.setDate(start.getDate() + diffToMonday);
      break;
    case "this_month":
      start.setDate(1);
      break;
    case "last_month":
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case "custom":
      if (startDate) start = new Date(startDate);
      if (endDate) end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      break;
    default:
      start.setDate(1); // Default to this month
      break;
  }

  return { start, end };
}

exports.getReportsSummary = async (req, res) => {
  try {
    const { range = "this_month", startDate, endDate } = req.query;
    const { start, end } = getDateRange(range, startDate, endDate);

    // MongoDB date filter query
    const dateQuery = {
      createdAt: { $gte: start, $lte: end },
    };

    const [
      appointments,
      totalPatientsCount,
      activePatientsCount,
      newPatientsCount,
      totalDoctorsCount,
      activeDoctorsCount,
      totalTreatmentsCount,
      activeTreatmentsCount,
      doctorsList,
      treatmentsList,
    ] = await Promise.all([
      Appointment.find(dateQuery).lean(),
      Patient.countDocuments(),
      Patient.countDocuments({ isActive: true }),
      Patient.countDocuments(dateQuery),
      Doctor.countDocuments(),
      Doctor.countDocuments({ isActive: true }),
      Treatment.countDocuments(),
      Treatment.countDocuments({ isActive: true }),
      Doctor.find({ isActive: true }).select("name specialization").lean(),
      Treatment.find({ isActive: true }).select("name category").lean(),
    ]);

    // Status breakdown
    const statusCounts = {
      total: appointments.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0,
    };

    const doctorBreakdownMap = {};
    const treatmentBreakdownMap = {};
    const dateTrendMap = {};

    appointments.forEach((app) => {
      const status = (app.status || "pending").toLowerCase();
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }

      // Doctor breakdown
      const docName = app.doctorName || "Unassigned Doctor";
      if (!doctorBreakdownMap[docName]) {
        doctorBreakdownMap[docName] = { total: 0, completed: 0, cancelled: 0 };
      }
      doctorBreakdownMap[docName].total++;
      if (status === "completed") doctorBreakdownMap[docName].completed++;
      if (status === "cancelled") doctorBreakdownMap[docName].cancelled++;

      // Treatment / Care breakdown
      const careName = app.care || "General Consultation";
      if (!treatmentBreakdownMap[careName]) {
        treatmentBreakdownMap[careName] = { total: 0, completed: 0 };
      }
      treatmentBreakdownMap[careName].total++;
      if (status === "completed") treatmentBreakdownMap[careName].completed++;

      // Date trend
      const dateKey = app.preferredDate || new Date(app.createdAt).toISOString().split("T")[0];
      dateTrendMap[dateKey] = (dateTrendMap[dateKey] || 0) + 1;
    });

    const doctorBreakdown = Object.keys(doctorBreakdownMap).map((key) => ({
      doctorName: key,
      ...doctorBreakdownMap[key],
    }));

    const treatmentBreakdown = Object.keys(treatmentBreakdownMap).map((key) => ({
      treatmentName: key,
      ...treatmentBreakdownMap[key],
    }));

    const dateTrend = Object.keys(dateTrendMap)
      .sort()
      .map((date) => ({
        date,
        count: dateTrendMap[date],
      }));

    res.json({
      success: true,
      rangeInfo: {
        range,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
      summary: {
        appointments: statusCounts,
        patients: {
          total: totalPatientsCount,
          active: activePatientsCount,
          newInPeriod: newPatientsCount,
        },
        doctors: {
          total: totalDoctorsCount,
          active: activeDoctorsCount,
        },
        treatments: {
          total: totalTreatmentsCount,
          active: activeTreatmentsCount,
        },
      },
      breakdowns: {
        doctorBreakdown,
        treatmentBreakdown,
        dateTrend,
      },
    });
  } catch (error) {
    console.error("Get reports summary error:", error);
    res.status(500).json({ success: false, message: "Failed to generate clinic report summary." });
  }
};

exports.exportAppointmentsCSV = async (req, res) => {
  try {
    const { range = "this_month", startDate, endDate } = req.query;
    const { start, end } = getDateRange(range, startDate, endDate);

    const appointments = await Appointment.find({
      createdAt: { $gte: start, $lte: end },
    })
      .sort({ createdAt: -1 })
      .lean();

    const headers = [
      "Booking ID",
      "Patient Name",
      "Phone",
      "Care / Treatment",
      "Doctor Name",
      "Preferred Date",
      "Time Slot",
      "Status",
      "Created At",
    ];

    const rows = appointments.map((a) => [
      `"${a.bookingId || ""}"`,
      `"${a.patientName || ""}"`,
      `"${a.phone || ""}"`,
      `"${a.care || ""}"`,
      `"${a.doctorName || ""}"`,
      `"${a.preferredDate || ""}"`,
      `"${a.timeSlot || ""}"`,
      `"${a.status || ""}"`,
      `"${new Date(a.createdAt).toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="jeevanjyot_report_${range}.csv"`);
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to export report CSV." });
  }
};
