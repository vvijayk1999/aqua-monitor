const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, "your-secret-key", { expiresIn: "1h" });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, "your-secret-key");
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
