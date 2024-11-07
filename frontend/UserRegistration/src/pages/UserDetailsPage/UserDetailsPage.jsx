import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import checkmedLogo from "../../assets/checkmedLogo.png";

import EmployeeVerification from "../../components/UserDetailsPageComponents/EmployeeVerification/EmployeeVerification.jsx";
import SampleCollectionType from "../../components/UserDetailsPageComponents/SampleCollectionType/SampleCollectionType.jsx";
import OnsiteForm from "../../components/UserDetailsPageComponents/forms/OnsiteForm/OnsiteForm.jsx";
import HomeCollectionForm from "../../components/UserDetailsPageComponents/forms/HomeCollectionForm/HomeCollectionForm.jsx";
import OffsiteForm from "../../components/UserDetailsPageComponents/forms/OffsiteForm/OffsiteForm.jsx";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiService.js";
import styles from "./UserDetailsPage.module.css";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const UserDetailsPage = ({ phoneNumber }) => {
  const [isEmployeeVerified, setIsEmployeeVerified] = useState(false);
  const [userResponse, setUserResponse] = useState({});
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [selectedSampleType, setSelectedSampleType] = useState("");
  const [packages, setPackages] = useState([]);
  const [subpackages, setSubpackages] = useState({});
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState(null);

  const client_identifier = localStorage.getItem("client");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientAndPackages = async () => {
      try {
        const clientResponse = await api.get(
          `/clients/client/${client_identifier}`
        );
        const clientData = clientResponse.data;
        const fetchedClientId = clientData.id;
        setClientId(fetchedClientId);
        localStorage.setItem("raw_clientId", fetchedClientId);

        const packagesResponse = await api.get(
          `/packages/clients/${clientId}/packages`
        );
        const fetchedPackages = packagesResponse.data;
        setPackages(fetchedPackages);
        localStorage.setItem("packages", JSON.stringify(fetchedPackages));

        const subpackagesByPackage = {};
        const subpackagePromises = fetchedPackages.map((pkg) =>
          api.get(`/subpackages/packages/${pkg.id}`).then((res) => {
            subpackagesByPackage[pkg.id] = res.data;
          })
        );

        await Promise.all(subpackagePromises);

        setSubpackages(subpackagesByPackage);
        localStorage.setItem(
          "subpackages",
          JSON.stringify(subpackagesByPackage)
        );
      } catch (error) {
        console.error(
          "Error fetching client, packages, and subpackages:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClientAndPackages();
  }, [clientId]);

  const handleEmployeeVerified = (data) => {
    setUserResponse(data.userResponse);
    setEmployeeName(data.employeeName);
    setEmployeeId(data.employeeId);
    setEmailId(data.emailId);
    setIsEmployeeVerified(true);
  };

  const handleSampleTypeSelection = (type) => {
    setSelectedSampleType(type);
  };

  if (loading) {
    return (
      <div className={styles.detailsContainer}>
        <div className={styles.loadingBox}>
          <img src={checkmedLogo} alt="Checkmed Logo" className={styles.logo} />
          <h1 className={styles.title}>CheckMed</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailsContainer}>
      <div
        className={`${styles.phoneInputBox} ${
          selectedSampleType === "Onsite"
            ? styles.onSite
            : selectedSampleType === "Offsite"
            ? styles.offSite
            : selectedSampleType === "Home Collection"
            ? styles.homeCollection
            : ""
        }`}
      >
        <img src={checkmedLogo} alt="Checkmed Logo" className={styles.logo} />
        <h1 className={styles.title}>CheckMed</h1>

        {!isEmployeeVerified && (
          <EmployeeVerification
            onVerified={handleEmployeeVerified}
            phoneNumber={phoneNumber}
          />
        )}

        {isEmployeeVerified && !selectedSampleType && (
          <SampleCollectionType onSelect={handleSampleTypeSelection} />
        )}

        {selectedSampleType === "Onsite" && (
          <OnsiteForm
            phoneNumber={phoneNumber}
            emailId={emailId}
            employeeName={employeeName}
            userResponse={userResponse}
            employeeId={employeeId}
            packages={packages}
            subpackages={subpackages}
            clientId={clientId}
          />
        )}

        {selectedSampleType === "Home Collection" && (
          <HomeCollectionForm
            phoneNumber={phoneNumber}
            emailId={emailId}
            employeeName={employeeName}
            userResponse={userResponse}
            employeeId={employeeId}
            packages={packages}
            subpackages={subpackages}
            clientId={clientId}
          />
        )}

        {selectedSampleType === "Offsite" && (
          <OffsiteForm
            phoneNumber={phoneNumber}
            emailId={emailId}
            employeeName={employeeName}
            userResponse={userResponse}
            employeeId={employeeId}
            packages={packages}
            subpackages={subpackages}
            clientId={clientId}
          />
        )}
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

UserDetailsPage.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  userData: PropTypes.object,
};

UserDetailsPage.defaultProps = {
  userData: {},
};

export default UserDetailsPage;
