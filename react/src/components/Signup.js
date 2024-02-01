import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import userIcon from '../ui/user.png';
import mailIcon from '../ui/mail.png';
import lockIcon from '../ui/lock.png';
import chipIcon from '../ui/chip.png';
import { signup } from '../api/auth'; // Import the signup function

const Signup = () => {
  // State to hold form input values
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // State to hold error messages
  const [errorMessage, setErrorMessage] = useState('');

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!firstName || !username || !password || !confirmPassword || !deviceId) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Clear previous error messages
    setErrorMessage('');
    setSuccessMessage('');

    // TODO: Make API request to signup
    try {
      const response = await signup(firstName, username, password, deviceId);

      if (response.success) {
        // Signup successful
        console.log('User created successfully');
        setSuccessMessage(response.message);
        // Redirect or perform any other action as needed
        setTimeout(() => {
          // Redirect logic here
          console.log('Redirecting to /login');
          navigate("/login");
        }, 3000);
      } else {
        // Signup failed, display error message
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.error('Error during signup:', error.message);
      setErrorMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className={styles.main}>
      <form onSubmit={handleSubmit}>
        <div>
          <img src={userIcon} alt="" />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <img src={mailIcon} alt="" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <img src={lockIcon} alt="" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <img src={lockIcon} alt="" />
          <input
            type="password"
            placeholder="Re-Type Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>
          <img src={chipIcon} alt="" />
          <input
            type="text"
            placeholder="Device ID"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
          />
        </div>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button className={styles['signin-btn']} type="submit">
          Create Account
        </button>
      </form>
      <div className={styles.signup}>
        <p>Already have an account?</p>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Signup;
