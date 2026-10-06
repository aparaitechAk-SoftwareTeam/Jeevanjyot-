const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (e) {
      // Ignore if dns.setServers fails
    }

    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jeevanjyot";

    try {
      await mongoose.connect(mongoUri);
      console.log("MongoDB connected successfully");
    } catch (primaryErr) {
      console.warn("Primary MONGODB_URI connection failed:", primaryErr.message);
      const fallbackUri = "mongodb://127.0.0.1:27017/jeevanjyot";
      if (mongoUri !== fallbackUri) {
        console.log("Attempting fallback to local MongoDB...");
        await mongoose.connect(fallbackUri);
        console.log("Local MongoDB connected successfully");
      } else {
        throw primaryErr;
      }
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
