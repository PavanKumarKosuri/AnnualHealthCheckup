// src/pages/HomeReportsPage/HomeReportsPage.jsx

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import checkmedLogo from "../../assets/checkmedLogo.png";
import styles from "./HomeReportsPage.module.css";
import Modal from "../../components/Modal/Modal";

const HomeReportsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve report data from location.state or localStorage
  const reportData =
    location.state || JSON.parse(localStorage.getItem("homeReportData")) || {};

  const {
    patientName,
    bookingId,
    selectedPackage,
    selectedSubPackage,
    dependents,
    address,
    collectionPreferences,
    timeSlot,
  } = reportData;

  const [showModal, setShowModal] = useState(false);

  // Handle browser's back button and custom navigation
  useEffect(() => {
    if (!patientName || !bookingId) {
      // Data is missing, redirect or show an error
      navigate("/bookings");
      return;
    }

    // Save report data to localStorage if not already saved
    if (location.state) {
      localStorage.setItem("homeReportData", JSON.stringify(reportData));
    }

    // Push a dummy state to the history stack
    window.history.pushState({ fromReports: true }, null, window.location.href);

    const handlePopState = (event) => {
      if (event.state && event.state.fromReports) {
        // Navigate to BookingsPage when back button is pressed
        navigate("/bookings", { replace: true });
      }
    };

    // Add event listener for popstate
    window.addEventListener("popstate", handlePopState);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
      // Optionally clear report data when component unmounts
      // localStorage.removeItem("homeReportData");
    };
  }, [navigate, patientName, bookingId, reportData, location.state]);

  return (
    <div className={styles.reportsContainer}>
      {showModal && <Modal title="Error" onClose={() => setShowModal(false)} />}
      {!showModal && (
        <div className={styles.reportsBox}>
          {/* Logo */}
          <img src={checkmedLogo} alt="CheckMed Logo" className={styles.logo} />
          <h1 className={styles.title}>CheckMed</h1>
          <h1 className={styles.patientName}>Name: {patientName}</h1>

          <div className={styles.reportsContent}>
            <div className={styles.reportsLeftSide}>
              {/* Optional Custom Back Button */}
              <button
                className={styles.backButton}
                onClick={() => navigate("/bookings")}
              >
                ← Back to Bookings
              </button>

              <div className={styles.timeslot}>
                <p>
                  Your Time slot: <strong>{timeSlot}</strong>
                </p>
              </div>

              <div className={styles.homeReportDetails}>
                <div className={styles.packageContainer}>
                  <div className={styles.packageInfo}>
                    <span className={styles.packageLabel}>
                      Package selected: <br />
                      <span className={styles.packageValue}>
                        {selectedPackage}
                      </span>
                    </span>
                  </div>
                  {selectedSubPackage && (
                    <div className={styles.packageInfo}>
                      <span className={styles.packageLabel}>
                        SubPackage selected: <br />
                        <span className={styles.packageValue}>
                          {selectedSubPackage}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
                <h2 className={styles.bookingId}>Booking ID: {bookingId}</h2>
              </div>

              <div className={styles.addressInfoCard}>
                <h3>Collection Address</h3>
                <p>{address.streetAddress}</p>
                <p>
                  {address.cityAddress}, {address.stateAddress} -{" "}
                  {address.zipCode}
                </p>
                {address.landmark && <p>Landmark: {address.landmark}</p>}
              </div>

              <div className={styles.collectionPreferences}>
                <h3>Collection Preferences</h3>
                <p>
                  <strong>Date:</strong> {collectionPreferences.preferredDate}
                </p>
                <p>
                  <strong>Time:</strong> {collectionPreferences.preferredTime}
                </p>
                <p>
                  <strong>Vendor:</strong>{" "}
                  {collectionPreferences.preferredVendor}
                </p>
                {collectionPreferences.preferredLanguage && (
                  <p>
                    <strong>Preferred Language:</strong>{" "}
                    {collectionPreferences.preferredLanguage}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.reportsRightSide}>
              {dependents && dependents.length > 0 && (
                <div className={styles.dependentsSection}>
                  <h3 className={styles.dependentsHeader}>
                    Dependents Information
                  </h3>
                  <div className={styles.dependentsGrid}>
                    {dependents.map((dependent) => (
                      <div
                        key={dependent.bookingId}
                        className={styles.dependentCard}
                      >
                        <div className={styles.dependentCardContent}>
                          <p>
                            <strong>{dependent.name}</strong>
                          </p>
                          <p>
                            <i>Booking ID:</i> {dependent.bookingId}
                          </p>
                          <p>
                            <i>Package:</i> {dependent.packageName}
                          </p>
                          {dependent.subPackageName && (
                            <p>
                              <i>SubPackage:</i> {dependent.subPackageName}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.notes}>
                <p>
                  <strong>Note:</strong>
                </p>
                <ul>
                  <li>
                    Show this booking ID to the phlebotomist during your home
                    visit.
                  </li>
                  <li>
                    Do not share your booking ID with others for privacy and
                    security.
                  </li>
                  <li>
                    Ensure someone is available at the provided address during
                    the selected time slot.
                  </li>
                  <li>Keep a valid ID proof ready for verification.</li>
                  <li>
                    Inform the helpline if you need to reschedule your home
                    collection.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className={styles.footerText}>© Checkmed.in</p>
        </div>
      )}
    </div>
  );
};

export default HomeReportsPage;
