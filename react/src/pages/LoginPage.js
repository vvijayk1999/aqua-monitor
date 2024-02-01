// src/pages/LoginPage.js
import './common.css'

import styles from './LoginPage.module.css';
import React from 'react';
import Login from '../components/Login';
import logoImg from '../ui/aquaMonitor-logo.png'

const LoginPage = () => {
  return (
    <div className={styles.root}>
    <div className={styles['main-container']}>
      <div className={styles.header}>
        <img src={logoImg} alt=""/>
        <h1>AquaMonitor</h1>
        <h3>Track and limit water consumption</h3>
      </div>
      <Login />
    </div>
    </div>
  );
};

export default LoginPage;
