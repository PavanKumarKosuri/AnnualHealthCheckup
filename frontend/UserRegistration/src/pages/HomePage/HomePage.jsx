// src/pages/HomePage/HomePage.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import api from "../../api/apiService.js";
import checkmedLogo from "../../assets/checkmedLogo.png";
import Modal from "../../components/Modal/Modal.jsx";
import styles from "./HomePage.module.css";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const HomePage = () => {
  const { hr_id, client_id } = useParams();
  const navigate = useNavigate();
  const { handlePhoneNumberSubmit, setIsAdmin, clearAllData } =
    useContext(UserContext);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const otpInputs = React.useRef([]);

  useEffect(() => {
    const validateClient = async () => {
      try {
        await clearAllData();
        const response = await api.get(`/users/validate-client/${client_id}`);
        if (response.data.valid) {
          localStorage.setItem("auth-token", response.data.token);
          localStorage.setItem("client", client_id);
          localStorage.setItem("hr_id", hr_id);
          setIsAdmin(true);
          const clientResponse = await api.get(`/clients/client/${client_id}`);
          const clientData = clientResponse.data;
          const fetchedClientId = clientData.id;
          localStorage.setItem("raw_clientId", fetchedClientId);
        } else {
          navigate("/404");
        }
      } catch (error) {
        console.error("Client validation error:", error);
        navigate("/404");
      }
    };
    validateClient();
  }, [client_id, hr_id, navigate, setIsAdmin]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (errorMessage) {
      setShowModal(true);
      const timeout = setTimeout(() => {
        setErrorMessage("");
        setShowModal(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  const handleNextClick = async () => {
    if (phoneNumber.length === 10) {
      setShowOTPInput(true);
      setTimer(30);
      setErrorMessage("");

      try {
        const response = await api.post(`/users/send-otp`, { phoneNumber });
        if (response.data.status === "Success") {
          setErrorMessage("OTP sent successfully");
        } else {
          setErrorMessage("Failed to send OTP");
        }
      } catch (err) {
        setErrorMessage(`Error: ${err.message}`);
      }
    } else {
      setErrorMessage("Please enter a valid 10-digit phone number");
    }
  };

  const handleOTPChange = (e, index) => {
    const updatedOTP = [...otp];
    const value = e.target.value.replace(/\D/g, "");
    if (value) {
      updatedOTP[index] = value;
      setOTP(updatedOTP);
      if (otpInputs.current[index + 1]) {
        otpInputs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      const updatedOTP = [...otp];
      if (index > 0 && updatedOTP[index] === "") {
        otpInputs.current[index - 1].focus();
      }
      updatedOTP[index] = "";
      setOTP(updatedOTP);
    }
  };

  const handleVerifyOTP = async () => {
    const enteredOTP = otp.join("");
    if (enteredOTP.length < 6) {
      setErrorMessage("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      const response = await api.post(`/users/verify-otp`, {
        phoneNumber,
        otp: enteredOTP,
      });
      if (response.data.verified) {
        await handlePhoneNumberSubmit(phoneNumber);
        navigate("/employee-verification");
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setErrorMessage(`Error verifying OTP: ${err.message}`);
    }
  };

  const handleResendOTP = () => {
    setTimer(30);
    setOTP(new Array(6).fill(""));
    if (otpInputs.current[0]) {
      otpInputs.current[0].focus();
    }
    handleNextClick();
  };

  const formatTime = (time) => `00:${time.toString().padStart(2, "0")}`;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.phoneInputBox}>
        <img src={checkmedLogo} alt="Checkmed Logo" className={styles.logo} />
        <h1 className={styles.title}>CheckMed</h1>
        <h2 className={styles.subtitle}>
          Your first step to take <br />
          charge of your health!
        </h2>

        {!showOTPInput ? (
          <>
            <div className={styles.inputGroup}>
              <div className={styles.countryCode}>+91</div>
              <input
                type="tel"
                placeholder="96587***25"
                value={phoneNumber}
                onChange={(e) => {
                  const input = e.target.value.replace(/\D/g, "");
                  if (input.length <= 10) {
                    setPhoneNumber(input);
                  }
                }}
                className={styles.phoneInput}
                maxLength={10}
                required
              />
            </div>
            <button
              onClick={handleNextClick}
              className={`${styles.btn} ${styles.nextButton}`}
            >
              Next
            </button>
            <p className={styles.footerText}>
              © Checkmed.in <br />
              <span className={styles.contactDetails}>
                <FaPhoneAlt /> 9459940849
              </span>
              <span
                className={styles.contactDetails}
                style={{ marginLeft: "10px" }}
              >
                <FaEnvelope /> support@checkmed.in
              </span>
            </p>
          </>
        ) : (
          <>
            <p className={styles.otpInstruction}>Enter OTP below:</p>
            <div className={styles.otpInputContainer}>
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="number"
                  value={value}
                  maxLength={1}
                  onChange={(e) => handleOTPChange(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  ref={(input) => (otpInputs.current[index] = input)}
                  className={styles.otpInput}
                  onPaste={(e) => e.preventDefault()} // Prevent pasting
                />
              ))}
            </div>
            {timer > 0 ? (
              <p className={styles.resendTimer}>
                Resend OTP in {formatTime(timer)}
              </p>
            ) : (
              <p
                className={styles.resendLink}
                onClick={handleResendOTP}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleResendOTP();
                }}
              >
                Resend OTP
              </p>
            )}
            <button
              onClick={handleVerifyOTP}
              className={`${styles.btn} ${styles.verifyButton}`}
            >
              Verify OTP
            </button>
            <p className={styles.footerText}>
              © Checkmed.in <br />
              <span className={styles.contactDetails}>
                <FaPhoneAlt /> 9459940849
              </span>
              <span
                className={styles.contactDetails}
                style={{ marginLeft: "10px" }}
              >
                <FaEnvelope /> support@checkmed.in
              </span>
            </p>
          </>
        )}
        {errorMessage && showModal && (
          <Modal
            id="homePageModal"
            title="Alert"
            message={errorMessage}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
