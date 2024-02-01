const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const influxDBToken = process.env.INFLUX_DB_TOKEN;
const influxDBUrl = process.env.INFLUX_DB_URL;
const influxDBOrg = process.env.INFLUX_DB_ORG;
const influxDBBucket = process.env.INFLUX_DB_BUCKET;

const { InfluxDB } = require("@influxdata/influxdb-client");

const token = influxDBToken;
const url = influxDBUrl;

const influx = new InfluxDB({ url, token });
const influxConf = [influxDBOrg, influxDBBucket];

module.exports = { influx, influxConf };
