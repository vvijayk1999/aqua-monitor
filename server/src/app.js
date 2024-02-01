const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const connection = require("./socket");

const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

const server = http.createServer(app);

const PORT = process.env.SERVER_PORT || 8080;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);

const wss = new WebSocket.Server({ server });
wss.on("connection", connection);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
