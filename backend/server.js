const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./src/config/db");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const doctorRoutes = require("./src/routes/doctorRoutes");
const treatmentRoutes = require("./src/routes/treatmentRoutes");
const contentRoutes = require("./src/routes/contentRoutes");
const recordsRoutes = require("./src/routes/recordsRoutes");
const patientPortalRoutes = require("./src/routes/patientPortalRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },
});

app.use("/api", apiLimiter);

app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", recordsRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/patient", patientPortalRoutes);
app.use("/api", contentRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Jeevanjyot API is running",
    timestamp: new Date().toISOString(),
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Jeevanjyot backend running on http://localhost:${PORT}`);
  });
};

startServer();

