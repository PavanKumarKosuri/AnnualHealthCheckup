import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import checkmedLogo from "../../assets/checkmedLogo.png";
import styles from "./SampleCollectionTypePage.module.css";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const SampleCollectionTypePage = () => {
  const navigate = useNavigate();
  const { handleSampleTypeSelection, clientData, fetchClientData } =
    useContext(UserContext);

  const [availableServices, setAvailableServices] = useState({
    onsite: false,
    offsite: false,
    homeCollection: false,
  });

  useEffect(() => {
    const client = localStorage.getItem("client");
    if (client) {
      fetchClientData(client);
    }
  }, [fetchClientData]);

  useEffect(() => {
    if (clientData) {
      setAvailableServices({
        onsite: clientData.servicesRequestedOnsite === 1,
        offsite: clientData.servicesRequestedOffsite === 1,
        homeCollection: clientData.servicesRequestedHomecollection === 1,
      });
    }
  }, [clientData]);

  const handleSelect = (type) => {
    localStorage.removeItem("bookingId");
    handleSampleTypeSelection(type);
    if (type === "Onsite") {
      navigate("/onsite-form");
    } else if (type === "Offsite") {
      navigate("/offsite-form");
    } else if (type === "Home Collection") {
      navigate("/home-collection-form");
    }
  };

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.phoneInputBox}>
        <button
          onClick={() => navigate("/bookings")}
          className={styles.backButton}
        >
          ← Back
        </button>
        <img src={checkmedLogo} alt="Checkmed Logo" className={styles.logo} />
        <h1 className={styles.title}>CheckMed</h1>

        <div className={styles.collectionContainer}>
          <h2 className={styles.subtitle}>
            Select your preferred <br /> checkup option
          </h2>
          <div className={styles.collectionTypes}>
            {/* Conditionally rendering buttons based on available services */}
            {availableServices.onsite && (
              <button
                onClick={() => handleSelect("Onsite")}
                className={styles.optionBtn}
              >
                Onsite
              </button>
            )}
            {availableServices.offsite && (
              <button
                onClick={() => handleSelect("Offsite")}
                className={styles.optionBtn}
              >
                Center Visit
              </button>
            )}
            {availableServices.homeCollection && (
              <button
                onClick={() => handleSelect("Home Collection")}
                className={styles.optionBtn}
              >
                Home Collection
              </button>
            )}
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
    </div>
  );
};

export default SampleCollectionTypePage;
