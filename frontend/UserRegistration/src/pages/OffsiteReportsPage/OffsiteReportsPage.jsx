import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import checkmedLogo from "../../assets/checkmedLogo.png";
import styles from "./OffsiteReportsPage.module.css";
import Modal from "../../components/Modal/Modal";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const OffsiteReportsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const reportData =
    location.state ||
    JSON.parse(localStorage.getItem("offsiteReportData")) ||
    {};

  const {
    patientName,
    bookingId,
    selectedPackage,
    selectedSubPackage,
    dependents,
    offsiteLocation,
    diagnosticCenter,
    timeslot,
    employeeId,
  } = reportData;

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!patientName || !bookingId) {
      navigate("/bookings");
      return;
    }

    if (location.state) {
      localStorage.setItem("offsiteReportData", JSON.stringify(reportData));
    }

    window.history.pushState({ fromReports: true }, null, window.location.href);

    const handlePopState = (event) => {
      if (event.state && event.state.fromReports) {
        navigate("/bookings", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, patientName, bookingId, reportData, location.state]);

  return (
    <div className={styles.reportsContainer}>
      {showModal && <Modal title="Error" onClose={() => setShowModal(false)} />}
      {!showModal && (
        <div className={styles.reportsBox}>
          <img src={checkmedLogo} alt="Checkmed Logo" className={styles.logo} />
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
              <div className={styles.timeSlot}>
                <p>
                  Your Time slot: <strong>{timeslot}</strong>
                </p>
              </div>

              <div className={styles.onsiteReportDetails}>
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

              <div className={styles.locationInfoCard}>
                <h3>Location Details</h3>
                {/* <p>
                  <strong>Offsite Location:</strong> {offsiteLocation.name}
                </p> */}
                <p>
                  <strong>Diagnostic Center:</strong> {diagnosticCenter.name}
                </p>
                <p>
                  <strong>Address:</strong> {diagnosticCenter.address},{" "}
                  {diagnosticCenter.city}, {diagnosticCenter.state} -{" "}
                  {diagnosticCenter.zipCode}
                </p>
                <p>
                  <strong>Contact:</strong> {diagnosticCenter.contactNumber}
                </p>
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
                      <div key={dependent.id} className={styles.dependentCard}>
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
                    Show this booking ID to the lab technician during your test.
                  </li>
                  <li>
                    Do not share your booking ID with others for privacy and
                    security.
                  </li>
                  <li>
                    Arrive on time for your allocated slot to avoid delays.
                  </li>
                  <li>Take a screenshot or note of your booking ID.</li>
                  <li>Bring a valid ID proof for verification.</li>
                  <li>
                    Inform the helpline if you cannot attend at the allocated
                    time.
                  </li>
                </ul>
              </div>
            </div>
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
      )}
    </div>
  );
};

export default OffsiteReportsPage;
