const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const jwtUtils = require("../utils/jwtUtility");
const { influx, influxConf } = require("../config/influxdb");

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

// Route to get water consumption data
router.get("/water-consumption", authenticateJWT, async (req, res) => {
  const { fromTime, toTime } = req.query; // Adjust to use query parameters

  // Check if any of the required fields are empty or undefined
  if (!fromTime || !toTime) {
    return res.status(400).json({ success: false, message: 'fromTime, and toTime are required' });
  }

  try {
    const { username } = req.user;
    const user = await userModel.findUserByUsername(username);

    let query;
    let meanDurationInSeconds = 1; // Every 1 second

    if(req.query.meanDurationInSeconds){
      meanDurationInSeconds = parseInt(req.query.meanDurationInSeconds);
    }

    if (user.role === "ADMIN") {
      // If user is an admin, no device_id filtering
      query = `
        from(bucket: "water-stats")
        |> range(start: ${fromTime}, stop: ${toTime})
        |> filter(fn: (r) => r._measurement == "water_usage")
        |> aggregateWindow(every: ${meanDurationInSeconds}s, fn: mean, createEmpty: false)
      `;
    } else {
      // For regular users, filter by device_id
      query = `
        from(bucket: "water-stats")
        |> range(start: ${fromTime}, stop: ${toTime})
        |> filter(fn: (r) => r._measurement == "water_usage" and r.device_id == "${user.deviceId}")
        |> aggregateWindow(every: ${meanDurationInSeconds}s, fn: mean, createEmpty: false)
      `;
    }

    const queryApi = influx.getQueryApi(influxConf[0]);
    const result = [];

    for await (const { values, tableMeta } of queryApi.iterateRows(query)) {
      const o = tableMeta.toObject(values);
      result.push({
        time: o._time,
        device_id: o.device_id,
        waterConsumed: o._value,
      });
      console.log(`${username}\t${o._time} ${o.device_id} Water Consumption: ${o._value}`);
    }

    res.json(result);
  } catch (error) {
    console.error(
      "Error fetching water consumption data from InfluxDB:",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get water level data
router.get("/water-level", authenticateJWT, async (req, res) => {
  const { fromTime, toTime } = req.query; // Adjust to use query parameters
  // Check if any of the required fields are empty or undefined
  if (!fromTime || !toTime) {
    return res.status(400).json({ success: false, message: 'fromTime, and toTime are required' });
  }
  
  try {
    const { username } = req.user;
    const user = await userModel.findUserByUsername(username);

    let query;
    let meanDurationInSeconds = 1; // Every 1 second

    if(req.query.meanDurationInSeconds){
      meanDurationInSeconds = parseInt(req.query.meanDurationInSeconds);
    }

    if (user.role === "ADMIN") {
      // If user is an admin, no device_id filtering
      query = `
        from(bucket: "water-stats")
        |> range(start: ${fromTime}, stop: ${toTime})
        |> filter(fn: (r) => r._measurement == "water_level")
        |> aggregateWindow(every: ${meanDurationInSeconds}s, fn: mean, createEmpty: false)
      `;
    } else {
      // For regular users, filter by device_id
      query = `
        from(bucket: "water-stats")
        |> range(start: ${fromTime}, stop: ${toTime})
        |> filter(fn: (r) => r._measurement == "water_level" and r.device_id == "${user.deviceId}")
        |> aggregateWindow(every: ${meanDurationInSeconds}s, fn: mean, createEmpty: false)
      `;
    }

    const queryApi = influx.getQueryApi(influxConf[0]);
    const result = [];

    for await (const { values, tableMeta } of queryApi.iterateRows(query)) {
      const o = tableMeta.toObject(values);
      result.push({
        time: o._time,
        device_id: o.device_id,
        waterLevel: o._value,
      });
      console.log(`${username}\t${o._time} ${o.device_id} Water Level: ${o._value}`);
    }

    res.json(result);
  } catch (error) {
    console.error(
      "Error fetching water level data from InfluxDB:",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
