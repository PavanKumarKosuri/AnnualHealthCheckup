// src/pages/BookingsPage/BookingsPage.jsx

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import checkmedLogo from "../../assets/checkmedLogo.png";
import styles from "./BookingsPage.module.css";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const BookingsPage = () => {
  const navigate = useNavigate();
  const {
    bookings,
    bookingsLoading,
    bookingsError,
    fetchUserBookings,
    deleteBooking,
  } = useContext(UserContext);

  const employeeId = localStorage.getItem("employeeId");
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    if (employeeId) {
      fetchUserBookings(employeeId);
    }
  }, [employeeId, fetchUserBookings]);

  const handleEdit = (booking) => {
    if (!booking) {
      console.error("Booking object is null or undefined");
      return;
    }
    if (!booking.collectionType) {
      console.error("Collection type is null or undefined");
      return;
    }

    let path;

    switch (booking.collectionType) {
      case "offSite":
        path = "/offsite-form";
        break;
      case "home":
        path = "/home-collection-form";
        break;
      case "onSite":
        path = "/onsite-form";
        break;
      default:
        console.error("Unknown collection type:", booking.collectionType);
        return;
    }

    navigate(path, {
      state: { bookingId: booking.bookingId },
    });
  };

  const handleDeleteBooking = (booking) => {
    setModal({
      show: true,
      title: "Confirm Deletion",
      message: `Are you sure you want to delete booking ID: ${booking.bookingId}?`,
      onConfirm: () => confirmDeleteBooking(booking.bookingId),
    });
  };

  const confirmDeleteBooking = async (bookingId) => {
    try {
      const response = await deleteBooking(bookingId);
      if (response.success) {
        setModal({
          show: true,
          title: "Success",
          message: `Booking ID: ${bookingId} has been successfully deleted.`,
          onConfirm: null,
        });

        fetchUserBookings(employeeId);
      } else {
        setModal({
          show: true,
          title: "Error",
          message: response.message || "Failed to delete the booking.",
          onConfirm: null,
        });
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      setModal({
        show: true,
        title: "Error",
        message:
          "An error occurred while deleting the booking. Please try again.",
        onConfirm: null,
      });
    }
  };

  const handleNewBooking = () => {
    navigate("/sample-collection-type");
  };

  const closeModal = () => {
    setModal({
      show: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && modal.show) {
        closeModal();
      }
    };

    if (modal.show) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modal.show]);

  useEffect(() => {
    if (modal.show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modal.show]);

  // Helper function to display collection type
  const getDisplayCollectionType = (type) => {
    switch (type) {
      case "offSite":
        return "Center Visit";
      case "home":
        return "Home Collection";
      case "onSite":
        return "Onsite Collection";
      default:
        return type;
    }
  };

  if (bookingsLoading) {
    return (
      <div className={styles.detailsContainer}>
        <div className={styles.phoneInputBox}>
          <img src={checkmedLogo} alt="Checkmed Logo" className={styles.logo} />
          <h1 className={styles.title}>Your Bookings</h1>
          <p className={styles.loadingText}>Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (bookingsError) {
    return (
      <div className={styles.detailsContainer}>
        <div className={styles.phoneInputBox}>
          <img src={checkmedLogo} alt="Checkmed Logo" className={styles.logo} />
          <h1 className={styles.title}>Your Bookings</h1>
          <p className={styles.errorText}>{bookingsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.phoneInputBox}>
        <img src={checkmedLogo} alt="Checkmed Logo" className={styles.logo} />
        <h1 className={styles.title}>Your Bookings</h1>
        <button
          onClick={() => navigate("/employee-verification")}
          className={styles.backButton}
        >
          ← Back
        </button>

        {/* Upcoming Bookings */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Upcoming Bookings</h2>
          {bookings.upcoming.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Type</th>
                  {/* <th>Date</th> */}
                  <th>Time Slot</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.upcoming.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td>{booking.bookingId}</td>
                    <td>{getDisplayCollectionType(booking.collectionType)}</td>
                    {/* <td>
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td> */}
                    <td>{booking.timeslot}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faPencilAlt}
                        className={styles.icon}
                        onClick={() => handleEdit(booking)}
                        title="Edit Booking"
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className={`${styles.icon} ${styles.deleteIcon}`}
                        onClick={() => handleDeleteBooking(booking)}
                        title="Delete Booking"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.noBookings}>No upcoming bookings.</p>
          )}
        </div>

        {/* Previous Bookings */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Previous Bookings</h2>
          {bookings.previous.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                </tr>
              </thead>
              <tbody>
                {bookings.previous.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td>{booking.bookingId}</td>
                    <td>{getDisplayCollectionType(booking.collectionType)}</td>
                    <td>
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td>{booking.timeslot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.noBookings}>No previous bookings.</p>
          )}
        </div>

        {/* Action Button */}
        <button className={styles.newBookingButton} onClick={handleNewBooking}>
          Continue with New Booking
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

        {/* Modal Integration */}
        {modal.show && (
          <Modal
            title={modal.title}
            message={modal.message}
            onClose={closeModal}
            onConfirm={modal.onConfirm}
          />
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
