import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import checkmedLogo from "../../assets/checkmedLogo.png";
import styles from "./OnsiteReportsPage.module.css";
import api from "../../api/apiService";
import PropTypes from "prop-types";
import Modal from "../../components/Modal/Modal";

const OnsiteReportsPage = () => {
  const location = useLocation();
  const {
    userId,
    client_id,
    patientName,
    bookingId,
    selectedPackage,
    selectedSubPackage,
    userResponse,
  } = location.state || {};

  const navigate = useNavigate();
  const [reportsTaken, setReportsTaken] = useState(false);
  const [timeSlot, setTimeSlot] = useState("");
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const assignTimeSlot = async (userId, client_id) => {
    try {
      const response = await api.put(`/users/timeslot/${userId}`, {
        client_id,
      });

      const assignedTimeSlot = response.data.timeslot;

      if (!assignedTimeSlot) {
        throw new Error("No available time slots today or in the future.");
      }

      setTimeSlot(assignedTimeSlot);

      const [timeRange, dateString] = assignedTimeSlot.split(" on ");
      if (timeRange && dateString) {
        const [startTime] = timeRange.split(" - ");
        if (startTime) {
          const scheduledDate = dateString;
          const scheduledTime = convertTo24HourFormat(startTime);
          await updateOnsiteCollection(userId, scheduledDate, scheduledTime);
        } else {
          throw new Error("Invalid time range in the time slot.");
        }
      } else {
        throw new Error("Invalid time slot format.");
      }
    } catch (error) {
      setError(error.message);
      setShowModal(true);
    }
  };

  const updateOnsiteCollection = async (
    userId,
    scheduledDate,
    scheduledTime
  ) => {
    try {
      await api.put(`/onsite-collections/${userId}`, {
        scheduledDate,
        scheduledTime,
      });
    } catch (error) {
      setError("Error updating onsite collection.");
      setShowModal(true);
    }
  };

  const convertTo24HourFormat = (time) => {
    const [timeString, modifier] = time.match(/[0-9]+|AM|PM/g);
    let [hours, minutes] = timeString.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    }
    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours}:${minutes || "00"}`;
  };

  useEffect(() => {
    if (!patientName || !bookingId) {
      navigate("/bookings");
      return;
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
  }, [navigate, patientName, bookingId, location.state]);

  useEffect(() => {
    if (userResponse) {
      setReportsTaken(
        userResponse.reportsTaken === 1 ||
          userResponse.reportsTaken === true ||
          userResponse.reportsTaken === "1"
      );

      assignTimeSlot(userId, client_id);
    } else {
      console.log("error");
    }
  }, [userResponse, client_id]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.reportsContainer}>
      {showModal && (
        <Modal title="Error" message={error} onClose={closeModal} />
      )}

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
                  Your Time slot: <strong>{timeSlot}</strong>
                </p>
              </div>
              <div>
                <h5
                  className={
                    reportsTaken ? styles.bloodCollected : styles.bloodPending
                  }
                >
                  {reportsTaken
                    ? "Blood sample collected"
                    : "Pending blood sample collection"}
                </h5>
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
            </div>

            <div className={styles.reportsRightSide}>
              <div className={styles.notes}>
                <p>
                  <strong>Note:</strong>
                </p>
                <ul>
                  <li>
                    Show this booking ID to the lab technician available at the
                    camp during your test in the time slot allocated to you.
                  </li>
                  <li>
                    Please do not share this booking ID with anyone else to
                    ensure your privacy and security.
                  </li>
                  <li>
                    Arrive at the camp center on the time for your allocated
                    time slot to avoid delays.
                  </li>
                  <li>
                    It is recommended to take note or screenshot of the booking
                    ID for your records.
                  </li>
                  <li>
                    Bring a valid ID proof along with the booking ID for
                    verification purposes.
                  </li>
                  <li>
                    If you cannot attend the camp to the allocated time, please
                    inform the helpline center as soon as possible.
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

OnsiteReportsPage.propTypes = {
  userResponse: PropTypes.shape({
    id: PropTypes.string,
    reportsTaken: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string,
    ]),
    timeslot: PropTypes.string,
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      userId: PropTypes.string,
      patientName: PropTypes.string,
      bookingId: PropTypes.string,
      selectedPackage: PropTypes.string,
      selectedSubPackage: PropTypes.string,
      userResponse: PropTypes.object,
      city: PropTypes.string,
      companyName: PropTypes.string,
    }),
  }),
};

export default OnsiteReportsPage;
