const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mysqlHost = process.env.MY_SQL_HOST;
const mysqlUser = process.env.MY_SQL_USER;
const mysqlPassword = process.env.MY_SQL_PASSWORD;
const mysqlDatabase = process.env.MY_SQL_DATABASE;


const mysql = require("mysql");

const db = mysql.createConnection({
  host: mysqlHost,
  user: mysqlUser,
  password: mysqlPassword,
  database: mysqlDatabase,
});

module.exports = db;
