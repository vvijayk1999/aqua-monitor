const { Point } = require("@influxdata/influxdb-client");
const { influx, influxConf } = require("./config/influxdb");

const connection = (ws) => {
  console.log("New websocket client connected");
  ws.on("message", function incoming(data) {
    try {
      const parsedData = JSON.parse(data);
      const writeApi = influx.getWriteApi(...influxConf);

      let waterUsagePoint = new Point("water_usage")
        .tag("device_id", parsedData.deviceId)
        .intField("value", parsedData.waterConsumed);

      let waterLevelPoint = new Point("water_level")
        .tag("device_id", parsedData.deviceId)
        .intField("value", parsedData.tankWaterVolume);

      writeApi.writePoint(waterUsagePoint);
      writeApi.writePoint(waterLevelPoint);

      writeApi.close().then(() => {
        console.log(`Persisted Data : ${data}`);
      });
    } catch (error) {
      console.error("Error processing and storing data:", error.message);
    }
  });
};

module.exports = connection;
