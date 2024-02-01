// src/pages/DashboardPage.js
import "./common.css";
import styles from './HomePage.module.css';
import winkImg from "../ui/wink.png";

import React from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";

const DashboardPage = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the JWT token from local storage
    localStorage.removeItem("jwtToken");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className={styles.root}>
      <div className={styles['main-container']}>
        <div className={styles['logout-wrapper']}>
          <button className={styles["btn-logout"]} onClick={handleLogout}>Logout</button>
        </div>
        <header className={`${styles.card} ${styles['margin-top-20']} ${styles['header-card']}`}>
          <div  className={styles['img-wrapper']}>
            <img className={styles['greeting-img']} src={winkImg} alt="" />
          </div>
          <div className={styles['header-data']}>
          <h1>Welcome Back</h1>
          <div className={`${styles['water-details']} ${styles['margin-top-20']}`}>
            <div>
              <h3>Water consumption</h3>
              <p>2500 mL</p>
            </div>
            <div>
              <h3>Water tank</h3>
              <p>10000000 mL</p>
            </div>
          </div>
          </div>
        </header>
      <Dashboard />
      </div>
      </div>
  );
};

export default DashboardPage;
