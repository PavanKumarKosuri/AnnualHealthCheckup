// src/pages/EmployeeVerificationPage/EmployeeVerificationPage.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";

import Modal from "../../components/Modal/Modal.jsx";
import checkmedLogo from "../../assets/checkmedLogo.png";
import styles from "./EmployeeVerificationPage.module.css";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const EmployeeVerificationPage = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { handleEmployeeVerification, phoneNumber } = useContext(UserContext);

  const handleConfirmClick = async () => {
    if (!employeeId) {
      setModalMessage("Please enter your Employee ID.");
      setShowModal(true);
      return;
    }

    const result = await handleEmployeeVerification(employeeId.trim());
    if (result.success) {
      localStorage.setItem("employeeId", employeeId);
      navigate("/bookings");
    } else {
      setModalMessage(result.message || "Verification failed.");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const hr_id = localStorage.getItem("hr_id");
  const client_id = localStorage.getItem("client");

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.phoneInputBox}>
        <button
          onClick={() => navigate(`/home-page/${hr_id}/${client_id}`)}
          className={styles.backButton}
        >
          ← Back
        </button>
        <img src={checkmedLogo} alt="Checkmed Logo" className={styles.logo} />
        <h1 className={styles.title}>CheckMed</h1>

        <div className={styles.employeeVerification}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>YOUR DETAILS</label>
            <input
              type="text"
              className={styles.inputField}
              value={phoneNumber}
              readOnly
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Employee ID <span className={styles.required}>*</span> :
            </label>
            <input
              type="text"
              className={styles.inputField}
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter your Employee ID"
            />
            <button
              className={styles.button}
              onClick={handleConfirmClick}
              disabled={employeeId.trim() === ""}
            >
              Confirm
            </button>
          </div>
          {showModal && (
            <Modal
              id="employeeVerificationModal"
              title="Alert"
              message={modalMessage}
              onClose={handleCloseModal}
            />
          )}
        </div>
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
      </div>
    </div>
  );
};

export default EmployeeVerificationPage;
