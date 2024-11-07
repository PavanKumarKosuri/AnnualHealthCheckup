import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import { UserContext } from "../../context/UserContext.jsx";

import CustomOption from "../../components/CustomOption/CustomOption.jsx";
import checkmedLogo from "../../assets/checkmedLogo.png";
import api from "../../api/apiService.js";
import styles from "./OnsiteFormPage.module.css";
import { v4 as uuidv4 } from "uuid";

const OnsiteFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    phoneNumber,
    userData,
    employeeData,
    packageData,
    handlePackageData,
  } = useContext(UserContext);
  const initialBookingId =
    location.state?.bookingId ||
    localStorage.getItem("bookingId") ||
    userData?.bookingId ||
    null;

  const [patientName, setPatientName] = useState(
    userData?.patient_name || employeeData?.employeeName || ""
  );
  const [email, setEmail] = useState(
    userData?.email || employeeData?.emailId || ""
  );
  const [age, setAge] = useState(userData?.age || employeeData?.age || "");

  const normalizeGender = (gender) => {
    if (!gender) return "";
    const trimmedGender = gender.trim().toLowerCase();
    if (trimmedGender === "male") return "Male";
    if (trimmedGender === "female") return "Female";
    return "Other";
  };
  const [selectedGender, setSelectedGender] = useState(
    normalizeGender(userData?.gender || employeeData?.gender || "")
  );
  const [bookingData, setBookingData] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedSubPackage, setSelectedSubPackage] = useState(null);
  const [subPackages, setSubPackages] = useState([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const storedClientId = useMemo(() => {
    return localStorage.getItem("raw_clientId") || null;
  }, []);

  useEffect(() => {
    const clientId = localStorage.getItem("client");
    if (clientId) {
      handlePackageData(clientId);
    }
  }, [handlePackageData]);

  useEffect(() => {
    if (initialBookingId) {
      fetchBookingDetails(initialBookingId);
    }
  }, [initialBookingId]);

  useEffect(() => {
    if (selectedPackage) {
      const subpackagesForSelectedPackage =
        packageData.subpackages[selectedPackage] || [];
      setSubPackages(subpackagesForSelectedPackage);
    }
  }, [selectedPackage, packageData.subpackages]);

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await api.get(`/users/bookings/${bookingId}/details`);
      const bookingDataResponse = response.data;
      if (!bookingDataResponse.user) {
        throw new Error("User is missing in the booking details.");
      }

      setBookingData(bookingDataResponse);
      setPatientName(bookingDataResponse.user.patientName || "");
      setEmail(bookingDataResponse.user.email || "");
      setAge(bookingDataResponse.user.age || "");
      setSelectedGender(normalizeGender(bookingDataResponse.user.gender));
      setSelectedPackage(String(bookingDataResponse.user.package));
      setSelectedSubPackage(
        bookingDataResponse.user.subPackage
          ? String(bookingDataResponse.user.subPackage)
          : null
      );
    } catch (error) {
      console.error("Error fetching booking details:", error);
      alert("Failed to load booking details. Please try again.");
    }
  };
  const clearFormData = () => {
    localStorage.removeItem("patientName");
    localStorage.removeItem("email");
    localStorage.removeItem("age");
    localStorage.removeItem("selectedGender");
    localStorage.removeItem("selectedPackage");
    localStorage.removeItem("selectedSubPackage");
    localStorage.removeItem("selectedCenter");
    localStorage.removeItem("dependents");
    localStorage.removeItem("preferredDate");
    localStorage.removeItem("preferredTime");
    localStorage.removeItem("bookingId");
  };

  const handleNextClick = async () => {
    let error = null;
    const isSubPackageRequired = subPackages.length > 0;

    if (
      patientName.trim() === "" ||
      email.trim() === "" ||
      age.toString().trim() === "" ||
      selectedGender.trim() === "" ||
      selectedPackage == null ||
      (isSubPackageRequired && selectedSubPackage == null)
    ) {
      error = "All fields are required to proceed.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error = "Please enter a valid email address.";
    } else if (isNaN(age) || parseInt(age, 10) <= 0) {
      error = "Please enter a valid age.";
    }

    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      setFormSubmitting(true);

      const userId = bookingData?.user?.id || userData?.id || null;
      const bookingId = bookingData?.bookingId || initialBookingId || null;
      const newBookingId =
        bookingId || `${employeeData.employeeId}-${uuidv4()}`;

      const { packageName, subPackageName } = getPackageAndSubPackageName(
        selectedPackage,
        selectedSubPackage
      );

      const userDataPayload = {
        client_id: storedClientId,
        hr_id: localStorage.getItem("hr_id"),
        phone_number: phoneNumber,
        patient_name: patientName,
        email,
        age,
        gender: selectedGender,
        package: selectedPackage,
        sub_package: selectedSubPackage || null,
        booking_id: newBookingId,
        collection_type: "onSite",
        employee_id: employeeData.employeeId,
      };

      let response;
      if (userId && bookingId) {
        response = await api.put(`/users/user/update`, userDataPayload);
      } else {
        response = await api.post("/users/user", userDataPayload);
      }
      clearFormData();
      const onsiteData = {
        userId: userId || response.data.userId,
        scheduledDate: new Date().toISOString().split("T")[0],
        scheduledTime: "00:00",
      };

      if (userId && bookingId) {
        await api.put(`/onsite-collections/${userId}`, onsiteData);
      } else {
        await api.post("/onsite-collections", onsiteData);
      }

      navigate("/onsite-reports", {
        state: {
          userId: userId || response.data.userId,
          client_id: localStorage.getItem("client"),
          hr_id: localStorage.getItem("hr_id"),
          patientName,
          phoneNumber,
          bookingId: newBookingId,
          selectedPackage: packageName,
          selectedSubPackage: subPackageName,
          userResponse: employeeData.userResponse,
        },
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      setErrorMessage("An error occurred while booking. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const getPackageAndSubPackageName = (packageId, subPackageId) => {
    const packageIdString = String(packageId);
    const subPackageIdString = String(subPackageId);

    const selectedPackageObj = packageData.packages.find(
      (pkg) => String(pkg.id) === packageIdString
    );

    const packageName =
      selectedPackageObj?.packageName || selectedPackageObj?.name || "";

    const subPackageList = packageData.subpackages[packageIdString] || [];

    const selectedSubPackageObj = subPackageList.find(
      (subPkg) => String(subPkg.id) === subPackageIdString
    );

    const subPackageName =
      selectedSubPackageObj?.subPackageName ||
      selectedSubPackageObj?.name ||
      "";

    return { packageName, subPackageName };
  };

  const handlePackageChange = (selectedOption) => {
    setSelectedPackage(selectedOption.value);
    setSelectedSubPackage(null);
  };

  const handleSubPackageChange = (selectedOption) => {
    setSelectedSubPackage(selectedOption.value);
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      height: "55px",
      background: "#ededed",
      boxShadow:
        "-10px -5px 5px 0px #ffffffc7 inset, 7px 7px 5px 0px #00000040 inset",
      border: "none",
      borderRadius: "25px",
      padding: "0 15px",
      fontSize: "18px",
      outline: "none",
      minHeight: "auto",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0",
      height: "55px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
      padding: "0",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      padding: "0",
    }),
    placeholder: (provided) => ({
      ...provided,
      margin: "0",
      padding: "0",
    }),
    singleValue: (provided) => ({
      ...provided,
      margin: "0",
      padding: "0",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 5,
      marginTop: "5px",
      borderRadius: "18px",
      background: "#ededed",
      overflow: "hidden",
      boxShadow:
        "0px 10px 30px rgba(0, 0, 0, 0.1), 0px 6px 10px rgba(0, 0, 0, 0.1)",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "0",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#e0e0e0" : "#ededed",
      color: "#333",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 15px",
    }),
  };

  const packageOptions = packageData.packages.map((pkg) => ({
    label: pkg.name || pkg.packageName,
    value: pkg.id,
    description: pkg.description,
  }));

  const subPackageOptions = subPackages.map((subPkg) => ({
    label: subPkg.name,
    value: subPkg.id,
    description: subPkg.description,
  }));

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.phoneInputBox}>
        <img src={checkmedLogo} alt="Checkmed Logo" className={styles.logo} />
        <h1 className={styles.title}>CheckMed</h1>

        <div className={styles.onsiteFormContainer}>
          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
          <button
            onClick={() => navigate("/bookings")}
            className={styles.backButton}
          >
            ← Back
          </button>
          <div className={styles.formGroupContainer}>
            <div className={styles.leftSide}>
              <div className={styles.formGroup}>
                <h5>YOUR DETAILS</h5>
                <label className={styles.fieldLabel}>
                  Phone Number <span className={styles.required}>*</span> :
                </label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={phoneNumber}
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.fieldLabel}>
                  Employee ID <span className={styles.required}>*</span> :
                </label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={employeeData?.employeeId || ""}
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.fieldLabel}>
                  Name <span className={styles.required}>*</span> :
                </label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.fieldLabel}>
                  Personal Email <span className={styles.required}>*</span> :
                </label>
                <input
                  type="email"
                  className={styles.inputField}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className={styles.rightSide}>
              <div className={styles.formGroup}>
                <label className={styles.fieldLabel}>
                  Age <span className={styles.required}>*</span> :
                </label>
                <input
                  type="number"
                  className={styles.inputField}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.fieldLabel}>
                  Gender <span className={styles.required}>*</span> :
                </label>
                <select
                  className={styles.inputField}
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.fieldLabel}>
                  Package <span className={styles.required}>*</span> :
                </label>
                <Select
                  options={packageOptions}
                  value={packageOptions.find(
                    (option) => String(option.value) === String(selectedPackage)
                  )}
                  onChange={handlePackageChange}
                  components={{ Option: CustomOption }}
                  placeholder="Select Package"
                  isDisabled={formSubmitting}
                  styles={customSelectStyles}
                  classNamePrefix="react-select"
                />
              </div>
              {subPackages.length > 0 && (
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>
                    Sub-Package <span className={styles.required}>*</span> :
                  </label>
                  <Select
                    options={subPackageOptions}
                    value={subPackageOptions.find(
                      (option) =>
                        String(option.value) === String(selectedSubPackage)
                    )}
                    onChange={handleSubPackageChange}
                    placeholder="Select Sub-Package"
                    isDisabled={
                      !selectedPackage ||
                      subPackages.length === 0 ||
                      formSubmitting
                    }
                    styles={customSelectStyles}
                    classNamePrefix="react-select"
                  />
                </div>
              )}
              <button
                className={styles.confirmBtn}
                onClick={handleNextClick}
                disabled={formSubmitting}
              >
                {formSubmitting ? "Booking..." : "Book"}
              </button>
            </div>
          </div>
        </div>

        <p className={styles.footerText}>© Checkmed.in</p>
      </div>
    </div>
  );
};

export default OnsiteFormPage;
