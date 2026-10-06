const bcrypt = require("bcryptjs");
require("dotenv").config();

const connectDB = require("../config/db");
const Admin = require("../models/Admin");

const seedAdmin = async () => {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
    }

    await connectDB();

    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();

    const existingAdmin = await Admin.findOne({ email });

    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    if (existingAdmin) {
      existingAdmin.passwordHash = passwordHash;
      existingAdmin.isActive = true;
      await existingAdmin.save();

      console.log(`Admin password updated for ${email}`);
    } else {
      await Admin.create({
        name: "Jeevanjyot Admin",
        email,
        passwordHash,
        role: "superadmin",
        isActive: true,
      });

      console.log(`Admin created successfully: ${email}`);
    }

    const Patient = require("../models/Patient");
    const patientCount = await Patient.countDocuments();
    if (patientCount === 0) {
      await Patient.insertMany([
        {
          patientId: "JJP-1001",
          name: "Mahesh Rajendra Kadam",
          phone: "7249300123",
          email: "mahesh.kadam@example.com",
          gender: "male",
          notes: "Regular Panchakarma consultation.",
        },
        {
          patientId: "JJP-1002",
          name: "Rahul Sharma",
          phone: "9822510456",
          email: "rahul.sharma@example.com",
          gender: "male",
          notes: "Ayurvedic wellness care.",
        },
        {
          patientId: "JJP-1003",
          name: "Sunita Patil",
          phone: "9035051086",
          email: "sunita.patil@example.com",
          gender: "female",
          notes: "Joint care and nutrition.",
        },
      ]);
      console.log("Sample patient records seeded successfully.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Admin seed error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
