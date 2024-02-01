// src/api/waterLevel.js
const serverUrl = process.env.REACT_APP_SERVER_URL;
const serverPort = process.env.REACT_APP_SERVER_PORT;

const BASE_URL = `${serverUrl}:${serverPort}/api/data`;

export const getWaterLevelData = async ({ fromTime, toTime, timeWindow }) => {
  try {
    // Construct the query parameters
    const queryParams = `?fromTime=${encodeURIComponent(fromTime)}&toTime=${encodeURIComponent(toTime)}&meanDurationInSeconds=${encodeURIComponent(timeWindow)}`;

    // Make the GET request with query parameters
    const response = await fetch(`${BASE_URL}/water-level${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwtToken"),
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};