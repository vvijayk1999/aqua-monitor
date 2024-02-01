const bcrypt = require("bcrypt");
const db = require("../config/mysql");

// Function to create a new user
const createUser = async (
  firstName,
  username,
  password,
  deviceId = "default",
  role = "USER"
) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO users (first_name, username, password, device_id, role) VALUES (?, ?, ?, ?, ?)`,
      [firstName, username, hashedPassword, deviceId, role],
      (err, result) => {
        if (err) {
          console.error("Error creating user:", err.message);
          reject(err);
        } else {
          resolve({ username, deviceId, role });
        }
      }
    );
  });
};

// Function to find a user by username
const findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM users WHERE username = ?`,
      [username],
      (err, result, fields) => {
        if (err) {
          console.error("Error finding user by username:", err.message);
          reject(err);
        } else {
          if (result.length > 0) {
            const user = result[0];
            resolve({
              firstName: user.firstName,
              username: user.username,
              password: user.password,
              deviceId: user.device_id,
              role: user.role,
            });
          } else {
            resolve(null);
          }
        }
      }
    );
  });
};

module.exports = {
  createUser,
  findUserByUsername,
};
