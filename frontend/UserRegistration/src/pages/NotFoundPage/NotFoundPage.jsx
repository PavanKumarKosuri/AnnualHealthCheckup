/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// src/pages/NotFoundPage/NotFoundPage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

import checkmedLogo from "../../assets/checkmedLogo.png";

import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/home-page");
  };

  return (
    <div className={styles.notfoundContainer}>
      <div className={styles.notfoundBox}>
        <img src={checkmedLogo} alt="Checkmed Logo" className={styles.logo} />
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.message}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <button
          className={`${styles.btn} ${styles.homeButton}`}
          onClick={handleGoHome}
        >
          Go to Home
        </button>
        <p className={styles.footerText}>© Checkmed.in</p>
      </div>
    </div>
  );
};

export default NotFoundPage;
