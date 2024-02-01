// src/components/Login.js
import styles from './Login.module.css'

import mailIcon from '../ui/mail.png'
import lockIcon from '../ui/lock.png'

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {login} from "../api/auth";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the server
      const { success, message, token } = await login(username, password);

      if (success) {
        // Store the token in local storage
        localStorage.setItem("jwtToken", token);

        // Reset form fields after successful submission (optional)
        setUsername("");
        setPassword("");
        setErrorMessage("");

        console.log("Login successful! Token:", token);

        // Redirect to Dashboard page
        navigate("/");
      } else {
        // Display error message
        setErrorMessage(message);
      }
    } catch (error) {
      // Handle login error (e.g., display a generic error message)
      console.error("Login failed:", error.message);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className={styles.main}>
        <form onSubmit={handleSubmit}>
          <div>
            <img src={mailIcon} alt="" />
            <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange}/>
          </div>
          <div>
            <img src={lockIcon} alt="" />
            <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <button className={styles['signin-btn']} type="submit">SignIn</button>
        </form>
        <div className={styles.signup}>
          <p>Don't have an account?</p>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
  );
};

export default Login;
