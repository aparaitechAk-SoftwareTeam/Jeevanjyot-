const jwt = require("jsonwebtoken");

const requirePatient = (req, res, next) => {
  try {
    const authorization = req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Patient authentication required.",
      });
    }

    const token = authorization.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Access restricted to patients.",
      });
    }

    req.patient = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired patient session.",
    });
  }
};

module.exports = requirePatient;
