const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwtUtils = require("../utils/jwtUtility");

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  const decoded = jwtUtils.verifyToken(token);

  if (!decoded) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }

  req.user = decoded;
  next();
};

// Route to check if token is valid
router.get("/isTokenValid", authenticateJWT, async (req, res) => {
  try {
    const { username } = req.user;
    const user = await userModel.findUserByUsername(username);

    res.json({ username: user.username, deviceId: user.deviceId });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to handle user signup
router.post("/signup", async (req, res) => {
  try {
    const {firstName, username, password, deviceId } = req.body;

    // Check if any of the required fields are empty or undefined
    if (!firstName || !username || !password || !deviceId) {
      return res.status(400).json({
        success: false,
        message: "firstName, Username, password, and deviceId are required",
      });
    }

    const existingUser = await userModel.findUserByUsername(username);

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const newUser = await userModel.createUser(firstName, username, password, deviceId);
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Route to handle user login and issue JWT
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if any of the required fields are empty or undefined
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Username, and password required" });
    }

    const user = await userModel.findUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    const token = jwtUtils.generateToken({ username: user.username });
    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
