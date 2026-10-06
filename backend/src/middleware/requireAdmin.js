const jwt = require("jsonwebtoken");

const requireAdmin = (req, res, next) => {
  try {
    const authorization = req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required.",
      });
    }

    const token = authorization.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token.",
    });
  }
};

module.exports = requireAdmin;
