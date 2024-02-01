// src/pages/SignupPage.js
import './common.css';
import styles from './LoginPage.module.css';
import React from 'react';
import Signup from '../components/Signup';
import logoImg from '../ui/aquaMonitor-logo.png'

const SignupPage = () => {
  return (
    <div className='root'>
    <div className={styles['main-container']}>
      <div className={styles.header}>
        <img src={logoImg} alt="" style={{height: '212px' }}/>
        <h1>AquaMonitor</h1>
        <h3>Track and limit water consumption</h3>
      </div>
      <Signup />
    </div>
    </div>
  );
};

export default SignupPage;
