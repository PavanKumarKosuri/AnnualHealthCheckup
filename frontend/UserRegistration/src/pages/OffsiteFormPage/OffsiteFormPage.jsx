// src/pages/OffsiteFormPage/OffsiteFormPage.jsx

import { useContext, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import { UserContext } from "../../context/UserContext.jsx";
import CustomOption from "../../components/CustomOption/CustomOption.jsx";
import checkmedLogo from "../../assets/checkmedLogo.png";
import api from "../../api/apiService.js";
import styles from "./OffsiteFormPage.module.css";
import {
  LocalizationProvider,
  DatePicker as MUIDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { initiateRazorpayPayment } from "../../razorpayService.js";
import PaymentModal from "../../components/Modal/PaymentModal.jsx";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const OffsiteFormPage = () => {
  const navigate = useNavigate();
  const {
    phoneNumber,
    userData,
    employeeData,
    packageData,
    handlePackageData,
    fetchUserBookings,
  } = useContext(UserContext);

  // Retrieve initialBookingId from localStorage or location.state
  const location = useLocation();
  const initialBookingId =
    location.state?.bookingId || localStorage.getItem("bookingId") || null;

  const [centersLoading, setCentersLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(!!initialBookingId);
  const [bookingData, setBookingData] = useState(null);
  const [patientName, setPatientName] = useState(
    localStorage.getItem("patientName") ||
      userData?.patientName ||
      employeeData?.employeeName ||
      ""
  );
  const [email, setEmail] = useState(
    localStorage.getItem("email") ||
      userData?.email ||
      employeeData?.emailId ||
      ""
  );
  const [age, setAge] = useState(
    localStorage.getItem("age") || employeeData?.age || ""
  );
  const [selectedGender, setSelectedGender] = useState(
    localStorage.getItem("selectedGender") || ""
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const normalizeGender = (gender) => {
    if (!gender) return "";
    const trimmedGender = String(gender).trim().toLowerCase();
    if (trimmedGender === "male") return "Male";
    if (trimmedGender === "female") return "Female";
    return "Other";
  };

  const [selectedPackage, setSelectedPackage] = useState(
    localStorage.getItem("selectedPackage") ||
      (userData?.package ? String(userData.package) : null) ||
      null
  );
  const [selectedSubPackage, setSelectedSubPackage] = useState(
    localStorage.getItem("selectedSubPackage") ||
      (userData?.subPackage ? String(userData.subPackage) : null) ||
      null
  );
  const [subPackages, setSubPackages] = useState([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [diagnosticCenters, setDiagnosticCenters] = useState([]);

  const [selectedCenter, setSelectedCenter] = useState(
    localStorage.getItem("selectedCenter") || ""
  );
  const [selectedCenterDetails, setSelectedCenterDetails] = useState(null);
  const [dependents, setDependents] = useState(
    JSON.parse(localStorage.getItem("dependents")) || []
  );
  const [originalDependents, setOriginalDependents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [validationError, setValidationError] = useState(null);
  const [deleteDependentId, setDeleteDependentId] = useState(null);
  const [currentDependent, setCurrentDependent] = useState({
    id: null,
    name: "",
    relation: "",
    age: "",
    gender: "",
    package: "",
    subPackage: "",
    subPackages: [],
  });
  const [preferredDate, setPreferredDate] = useState(
    localStorage.getItem("preferredDate") || ""
  );
  const [preferredTime, setPreferredTime] = useState(
    localStorage.getItem("preferredTime") || ""
  );
  const [dependentsLoading, setDependentsLoading] = useState(false);
  const [dependentsError, setDependentsError] = useState(null);
  const [coordinatesError, setCoordinatesError] = useState(null);
  const addButtonRef = useRef(null);
  const formRef = useRef(null);

  const storedClientId = useMemo(() => {
    return localStorage.getItem("raw_clientId") || null;
  }, []);

  const storedHrId = useMemo(() => {
    return localStorage.getItem("hr_id") || null;
  }, []);

  const storedPackages = useMemo(() => {
    return packageData.packages || [];
  }, [packageData.packages]);

  const storedSubpackages = useMemo(() => {
    return packageData.subpackages || {};
  }, [packageData.subpackages]);

  const [userCoordinates, setUserCoordinates] = useState(null);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("patientName", patientName);
  }, [patientName]);

  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem("age", age);
  }, [age]);

  useEffect(() => {
    localStorage.setItem("selectedGender", selectedGender);
  }, [selectedGender]);

  useEffect(() => {
    localStorage.setItem("selectedPackage", selectedPackage);
  }, [selectedPackage]);

  useEffect(() => {
    localStorage.setItem("selectedSubPackage", selectedSubPackage);
  }, [selectedSubPackage]);

  useEffect(() => {
    localStorage.setItem("selectedCenter", selectedCenter);
  }, [selectedCenter]);

  useEffect(() => {
    localStorage.setItem("dependents", JSON.stringify(dependents));
  }, [dependents]);

  useEffect(() => {
    localStorage.setItem("preferredDate", preferredDate);
  }, [preferredDate]);

  useEffect(() => {
    localStorage.setItem("preferredTime", preferredTime);
  }, [preferredTime]);

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentError(null);
  };

  const handleProceedToPay = async () => {
    setPaymentError(null);
    let userId = null;
    try {
      let bookingId = initialBookingId;
      let bookingResult = null;

      bookingResult = await handleNextClick();

      if (!bookingResult) {
        throw new Error("Failed to create or update booking.");
      }

      userId = bookingResult.userId;
      bookingId = bookingResult.bookingId;

      let dependentsToPayFor = [];

      if (!initialBookingId) {
        dependentsToPayFor = dependents;
      } else {
        dependentsToPayFor = dependents.filter((dep) => dep.isNew);
      }

      const totalAmount = dependentsToPayFor.length * 2500;

      if (dependentsToPayFor.length === 0) {
        // Clear form data from localStorage after successful booking
        clearFormData();

        // Save report data to localStorage
        saveReportDataToLocalStorage(bookingResult);

        navigate("/offsite-reports", {
          state: bookingResult.userDetails,
          replace: true,
        });
      } else {
        const dependentsIds = dependentsToPayFor.map((dep) => dep.id);

        await initiateRazorpayPayment(
          userId,
          dependentsIds,
          bookingId,
          totalAmount,
          async () => {
            try {
              await api.put(`/offsite-collections/${userId}`, {
                dependents_count: dependents.length,
              });

              if (!initialBookingId) {
                await Promise.all(
                  dependents
                    .filter((dep) => !dep.isNew)
                    .map(async (dep, index) => {
                      const dependentBookingId = `${bookingId}-D${index + 1}`;
                      const dependentData = {
                        bookingId: dependentBookingId,
                      };
                      await api.put(`/dependents/${dep.id}`, dependentData);
                      dep.bookingId = dependentBookingId;
                    })
                );

                await Promise.all(
                  dependents
                    .filter((dep) => dep.isNew)
                    .map(async (dep, index) => {
                      const dependentBookingId = `${bookingId}-D${
                        dependents.filter((d) => !d.isNew).length + index + 1
                      }`;
                      const { packageName, subPackageName } =
                        getPackageAndSubPackageName(
                          dep.package,
                          dep.subPackage
                        );

                      const newDependentResponse = await api.post(
                        "/dependents",
                        {
                          user_id: userId,
                          name: dep.name,
                          age: dep.age,
                          gender: dep.gender,
                          relationship: dep.relation,
                          package: dep.package,
                          subPackage: dep.subPackage || null,
                          bookingId: dependentBookingId,
                          employee_id: employeeData.employeeId,
                        }
                      );

                      dep.id = newDependentResponse.data.dependentId;
                      dep.isNew = false;
                      dep.bookingId = dependentBookingId;
                      dep.packageName = packageName;
                      dep.subPackageName = subPackageName;
                    })
                );
              } else {
                await Promise.all(
                  dependentsToPayFor.map(async (dep, index) => {
                    const dependentBookingId = `${bookingId}-D${
                      dependents.filter((d) => !d.isNew).length + index + 1
                    }`;
                    const { packageName, subPackageName } =
                      getPackageAndSubPackageName(dep.package, dep.subPackage);

                    const newDependentResponse = await api.post("/dependents", {
                      user_id: userId,
                      name: dep.name,
                      age: dep.age,
                      gender: dep.gender,
                      relationship: dep.relation,
                      package: dep.package,
                      subPackage: dep.subPackage || null,
                      bookingId: dependentBookingId,
                      employee_id: employeeData.employeeId,
                    });

                    dep.id = newDependentResponse.data.dependentId;
                    dep.isNew = false;
                    dep.bookingId = dependentBookingId;
                    dep.packageName = packageName;
                    dep.subPackageName = subPackageName;
                  })
                );
              }

              // Clear form data from localStorage after successful booking
              clearFormData();

              // Save report data to localStorage
              saveReportDataToLocalStorage(bookingResult);
              await fetchUserBookings(employeeData.employeeId);
              navigate("/offsite-reports", {
                state: bookingResult.userDetails,
                replace: true,
              });
            } catch (updateError) {
              console.error(
                "Error updating collections and dependents:",
                updateError
              );
              setPaymentError(
                "Payment succeeded, but an error occurred while updating your booking details. Please contact support."
              );
            }
          },
          async (errorMessage) => {
            setPaymentError(
              errorMessage || "Payment failed. Please try again."
            );
            if (!initialBookingId && userId) {
              try {
                await api.delete(`/users/${userId}`);
              } catch (deleteError) {
                console.error(
                  "Error deleting user after payment failure:",
                  deleteError
                );
              }
            }
          }
        );
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      setPaymentError(error.message || "An unexpected error occurred.");
      setIsPaymentModalOpen(true);
      if (!initialBookingId && userId) {
        try {
          await api.delete(`/users/${userId}`);
        } catch (deleteError) {
          console.error(
            "Error deleting user after payment failure:",
            deleteError
          );
        }
      }
    }
  };

  const selectedPackageName = (packageId) => {
    const pkg = storedPackages.find((p) => String(p.id) === String(packageId));
    return pkg ? pkg.name || pkg.packageName : "";
  };

  const selectedSubPackageName = (subPackageId) => {
    for (const pkgId in storedSubpackages) {
      const subPkg = storedSubpackages[pkgId].find(
        (sp) => String(sp.id) === String(subPackageId)
      );
      if (subPkg) return subPkg.name || subPkg.subPackageName;
    }
    return "";
  };

  const validateDependents = () => {
    for (let dep of dependents) {
      const isSubPackageRequired =
        storedSubpackages[dep.package]?.length > 0 || false;
      if (
        !dep.name.trim() ||
        !dep.relation.trim() ||
        !dep.age.toString().trim() ||
        !dep.gender.trim() ||
        !dep.package ||
        (isSubPackageRequired && !dep.subPackage)
      ) {
        return `Please fill all required fields for dependent ${
          dep.name || "(Unnamed)"
        }`;
      }
      if (isNaN(dep.age) || parseInt(dep.age, 10) <= 0) {
        return `Please enter a valid age for dependent ${dep.name}`;
      }
    }
    return null;
  };

  const validateFields = () => {
    const isSubPackageRequired = subPackages.length > 0;
    let error = null;

    if (
      patientName.trim() === "" ||
      email.trim() === "" ||
      age.toString().trim() === "" ||
      selectedGender.trim() === "" ||
      selectedPackage == null ||
      (isSubPackageRequired && selectedSubPackage == null) ||
      String(selectedCenter).trim() === "" ||
      preferredDate.trim() === "" ||
      preferredTime.trim() === ""
    ) {
      error = "All fields are required to proceed.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error = "Please enter a valid email address.";
    } else if (isNaN(age) || parseInt(age, 10) <= 0) {
      error = "Please enter a valid age.";
    }

    return error;
  };

  const handlePayAndBookClick = async () => {
    const error = validateFields();
    const dependentError = validateDependents();

    if (error || dependentError) {
      setValidationError(error || dependentError);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  useEffect(() => {
    if (initialBookingId) {
      fetchBookingDetails(initialBookingId);
    } else if (employeeData.employeeId) {
      fetchDependentsForExistingUser(employeeData.employeeId);
    }
  }, [initialBookingId, employeeData.employeeId]);

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await api.get(`/users/bookings/${bookingId}/details`);
      const bookingDataResponse = response.data;

      if (!bookingDataResponse.user) {
        throw new Error("User is missing in the booking details.");
      }

      setBookingData(bookingDataResponse);

      // Update form fields from fetched data and save to localStorage
      setPatientName(bookingDataResponse.user.patientName || "");
      setEmail(bookingDataResponse.user.email || "");
      setAge(bookingDataResponse.user.age || "");
      setSelectedGender(normalizeGender(bookingDataResponse.user.gender));

      localStorage.setItem(
        "patientName",
        bookingDataResponse.user.patientName || ""
      );
      localStorage.setItem("email", bookingDataResponse.user.email || "");
      localStorage.setItem("age", bookingDataResponse.user.age || "");
      localStorage.setItem(
        "selectedGender",
        normalizeGender(bookingDataResponse.user.gender)
      );

      const selectedPackageOption = storedPackages.find(
        (pkg) => String(pkg.id) === String(bookingDataResponse.user.package)
      );

      if (selectedPackageOption) {
        setSelectedPackage(String(selectedPackageOption.id));
        localStorage.setItem(
          "selectedPackage",
          String(selectedPackageOption.id)
        );
      }
      setSelectedSubPackage(
        bookingDataResponse.user.subPackage
          ? String(bookingDataResponse.user.subPackage)
          : null
      );
      localStorage.setItem(
        "selectedSubPackage",
        bookingDataResponse.user.subPackage
          ? String(bookingDataResponse.user.subPackage)
          : ""
      );

      if (bookingDataResponse.diagnosticCenter?.id) {
        setSelectedCenter(String(bookingDataResponse.diagnosticCenter.id));
        localStorage.setItem(
          "selectedCenter",
          String(bookingDataResponse.diagnosticCenter.id)
        );
      } else {
        setSelectedCenter("");
        localStorage.removeItem("selectedCenter");
      }

      setPreferredDate(
        bookingDataResponse.offsite?.scheduledDate
          ? dayjs(bookingDataResponse.offsite.scheduledDate).format(
              "YYYY-MM-DD"
            )
          : ""
      );
      localStorage.setItem(
        "preferredDate",
        bookingDataResponse.offsite?.scheduledDate
          ? dayjs(bookingDataResponse.offsite.scheduledDate).format(
              "YYYY-MM-DD"
            )
          : ""
      );

      if (
        bookingDataResponse.offsite &&
        bookingDataResponse.offsite.scheduledTime
      ) {
        const preferredTime = bookingDataResponse.offsite.scheduledTime.slice(
          0,
          5
        );
        setPreferredTime(preferredTime);
        localStorage.setItem("preferredTime", preferredTime);
      } else {
        setPreferredTime("");
        localStorage.removeItem("preferredTime");
      }

      const formattedDependents = bookingDataResponse.dependents.map((dep) => ({
        id: dep.id,
        name: dep.name,
        relation: dep.relationship || dep.relation,
        age: dep.age,
        gender: dep.gender,
        package: String(dep.package),
        subPackage: dep.subPackage ? String(dep.subPackage) : null,
        bookingId: dep.bookingId,
        subPackages: storedSubpackages[String(dep.package)] || [],
        packageName: selectedPackageName(dep.package),
        subPackageName: selectedSubPackageName(dep.subPackage),
        isNew: false,
      }));

      setDependents(formattedDependents);
      setOriginalDependents(formattedDependents);

      // Save dependents to localStorage
      localStorage.setItem("dependents", JSON.stringify(formattedDependents));

      formattedDependents.forEach((dep) => {
        if (dep.package) {
          fetchDependentSubPackages(dep.package, dep.id);
        }
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      alert("Failed to load booking details. Please try again.");
      setIsLoading(false);
    }
  };

  const fetchDependentsForExistingUser = async (employeeId) => {
    setDependentsLoading(true);
    setDependentsError(null);
    try {
      const response = await api.get(`/dependents/employee/${employeeId}`);
      const fetchedDependents = response.data.map((dep) => ({
        id: dep.id,
        name: dep.name,
        relation: dep.relationship || dep.relation,
        age: dep.age,
        gender: dep.gender,
        package: String(dep.package),
        subPackage: dep.subPackage ? String(dep.subPackage) : null,
        subPackages: storedSubpackages[String(dep.package)] || [],
        packageName: selectedPackageName(dep.package),
        subPackageName: selectedSubPackageName(dep.subPackage),
        isNew: false,
      }));

      setDependents(fetchedDependents);
      setOriginalDependents(fetchedDependents);

      // Save dependents to localStorage
      localStorage.setItem("dependents", JSON.stringify(fetchedDependents));

      fetchedDependents.forEach((dep) => {
        if (dep.package) {
          fetchDependentSubPackages(dep.package, dep.id);
        }
      });
    } catch (error) {
      console.error("Error fetching dependents:", error);
      setDependentsError("Failed to load dependents. Please try again.");
    } finally {
      setDependentsLoading(false);
    }
  };

  useEffect(() => {
    const clientId = localStorage.getItem("client");
    if (clientId) {
      handlePackageData(clientId);
    }
  }, [handlePackageData]);

  useEffect(() => {
    if (userData?.gender) {
      const normalizedGender = normalizeGender(userData.gender);
      setSelectedGender(normalizedGender);
    } else if (employeeData?.gender) {
      const normalizedGender = normalizeGender(employeeData.gender);
      setSelectedGender(normalizedGender);
    }
  }, [userData, employeeData]);

  useEffect(() => {
    if (bookingData && storedPackages.length > 0 && bookingData.user.package) {
      const selectedPackageOption = storedPackages.find(
        (pkg) => String(pkg.id) === String(bookingData.user.package)
      );
      if (selectedPackageOption) {
        setSelectedPackage(String(selectedPackageOption.id));
      }
    }
  }, [bookingData, storedPackages]);

  const timeSlots = useMemo(
    () => [
      { label: "7:00 AM - 8:00 AM", value: "07:00" },
      { label: "8:00 AM - 9:00 AM", value: "08:00" },
      { label: "9:00 AM - 10:00 AM", value: "09:00" },
      { label: "10:00 AM - 11:00 AM", value: "10:00" },
      { label: "11:00 AM - 12:00 PM", value: "11:00" },
      { label: "12:00 PM - 1:00 PM", value: "12:00" },
      { label: "1:00 PM - 2:00 PM", value: "13:00" },
      { label: "2:00 PM - 3:00 PM", value: "14:00" },
      { label: "3:00 PM - 4:00 PM", value: "15:00" },
    ],
    []
  );

  const convertTimeTo12HourFormat = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const hours = parseInt(hour, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const disableDates = (date) => {
    const dayAfterTomorrow = dayjs().add(2, "day").startOf("day");
    const isBeforeMin = date.isBefore(dayAfterTomorrow, "day");
    const dayOfWeek = date.day();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    return isBeforeMin || isWeekend;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const fetchNearestCenters = async () => {
    if (!userCoordinates) return;

    const { latitude: userLat, longitude: userLng } = userCoordinates;
    setCentersLoading(true);
    try {
      const response = await api.get("/diagnostic-centers");
      const centers = response.data;

      const centersWithMissingCoords = centers.filter(
        (center) => !center.latitude || !center.longitude
      );

      if (centersWithMissingCoords.length > 0) {
        setCoordinatesError(
          "Some diagnostic centers are missing latitude or longitude data."
        );
      }

      const nearbyCenters = centers
        .filter((center) => center.latitude && center.longitude)
        .map((center) => {
          const distance = calculateDistance(
            userLat,
            userLng,
            center.latitude,
            center.longitude
          );
          return { ...center, distance };
        })
        .sort((a, b) => a.distance - b.distance);

      setDiagnosticCenters(nearbyCenters);
    } catch (error) {
      console.error("Error fetching diagnostic centers:", error);
      alert("Failed to load diagnostic centers. Please try again.");
    } finally {
      setCentersLoading(false);
    }
  };

  useEffect(() => {
    setCentersLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoordinates({ latitude, longitude });
          fetchNearestCenters();
        },
        (error) => {
          setCentersLoading(false);
          if (error.code === error.PERMISSION_DENIED) {
            console.error("User denied the request for Geolocation.");
            alert(
              "Please enable location services to find the nearest centers."
            );
          } else {
            console.error("Error fetching location:", error);
            alert("An error occurred while fetching your location.");
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by your browser.");
      setCentersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userCoordinates) {
      fetchNearestCenters();
    }
  }, [userCoordinates]);

  useEffect(() => {
    const subpackagesForSelectedPackage =
      storedSubpackages[selectedPackage] || [];
    setSubPackages(subpackagesForSelectedPackage);
    setSelectedSubPackage(null);
  }, [selectedPackage, storedSubpackages]);

  const handlePackageChange = (packageId) => {
    setSelectedPackage(String(packageId));
    setSelectedSubPackage(null);
  };

  const handleSubPackageChange = (subPackageId) => {
    setSelectedSubPackage(String(subPackageId));
  };

  const handleCenterChange = (e) => {
    const centerId = e.target.value;
    setSelectedCenter(centerId);
    const center = diagnosticCenters.find(
      (c) => String(c.id) === String(centerId)
    );
    setSelectedCenterDetails(center);
  };

  const handleNextClick = async () => {
    const error = validateFields();
    const dependentError = validateDependents();

    if (error || dependentError) {
      setValidationError(error || dependentError);
      return null;
    }

    try {
      let newBookingId =
        initialBookingId || `${employeeData.employeeId}-${uuidv4()}`;

      const { packageName, subPackageName } = getPackageAndSubPackageName(
        selectedPackage,
        selectedSubPackage
      );

      const formattedTime = convertTimeTo12HourFormat(preferredTime);
      const endHour = parseInt(preferredTime.split(":")[0], 10) + 1;
      const endTime =
        endHour < 24 ? `${endHour.toString().padStart(2, "0")}:00` : "00:00";
      const formattedEndTime = convertTimeTo12HourFormat(endTime);
      const timeSlot = `${formattedTime} - ${formattedEndTime} on ${preferredDate}`;

      const userDataPayload = {
        client_id: storedClientId,
        hr_id: storedHrId,
        phone_number: phoneNumber,
        patient_name: patientName,
        email,
        age,
        gender: selectedGender,
        package: selectedPackage,
        sub_package: selectedSubPackage || null,
        booking_id: newBookingId,
        collection_type: "offSite",
        employee_id: employeeData.employeeId,
        timeslot: timeSlot,
      };
      setFormSubmitting(true);

      let response;

      if (bookingData) {
        response = await api.put(`/users/user/update`, userDataPayload);
      } else {
        response = await api.post("/users/user", userDataPayload);
      }
      const userId = response.data.userId;

      const offsiteCollectionData = {
        userId: userId,
        offsiteLocationId: 1, // default location ID
        diagnosticCenterId: Number(selectedCenter),
        dependents_count: dependents.length,
        scheduledDate: preferredDate,
        scheduledTime: preferredTime,
      };

      if (bookingData) {
        await api.put(`/offsite-collections/${userId}`, offsiteCollectionData);
      } else {
        await api.post("/offsite-collections", offsiteCollectionData);
      }

      const existingDependents = originalDependents;
      const existingDependentIds = existingDependents.map((dep) => dep.id);

      if (initialBookingId) {
        await Promise.all(
          dependents
            .filter(
              (dep) => !dep.isNew && existingDependentIds.includes(dep.id)
            )
            .map(async (dep, index) => {
              const dependentBookingId = `${newBookingId}-D${index + 1}`;
              const dependentData = {
                user_id: userId,
                name: dep.name,
                age: dep.age,
                gender: dep.gender,
                relationship: dep.relation,
                package: dep.package,
                subPackage: dep.subPackage || null,
                bookingId: dependentBookingId,
                employee_id: employeeData.employeeId,
              };
              await api.put(`/dependents/${dep.id}`, dependentData);
              dep.bookingId = dependentBookingId;
            })
        );

        const removedDependents = existingDependents.filter(
          (existingDep) => !dependents.find((dep) => dep.id === existingDep.id)
        );

        await Promise.all(
          removedDependents.map(async (removedDep) => {
            await api.put(`/dependents/${removedDep.id}`, {
              bookingId: null,
            });
          })
        );
      }

      const selectedCenterObject = diagnosticCenters.find(
        (center) => String(center.id) === String(selectedCenter)
      );

      return {
        userId,
        bookingId: newBookingId,
        dependents,
        userDetails: {
          userId,
          client_id: storedClientId,
          hr_id: storedHrId,
          patientName,
          phoneNumber,
          bookingId: newBookingId,
          selectedPackage: packageName,
          selectedSubPackage: subPackageName,
          userResponse: employeeData.userResponse,
          dependents,
          offsiteLocation: "default",
          diagnosticCenter: selectedCenterObject,
          timeslot: timeSlot,
          employeeId: employeeData.employeeId,
        },
      };
    } catch (error) {
      console.error("Error submitting the form:", error);
      setValidationError("An error occurred while booking. Please try again.");
      return null;
    } finally {
      setFormSubmitting(false);
    }
  };

  const getPackageAndSubPackageName = (packageId, subPackageId) => {
    const packageIdString = String(packageId);
    const subPackageIdString = String(subPackageId);

    const selectedPackageObj = storedPackages.find(
      (pkg) => String(pkg.id) === packageIdString
    );

    const packageName =
      selectedPackageObj?.packageName || selectedPackageObj?.name || "";

    const subPackageList = storedSubpackages[packageIdString] || [];

    const selectedSubPackageObj = subPackageList.find(
      (subPkg) => String(subPkg.id) === subPackageIdString
    );

    const subPackageName =
      selectedSubPackageObj?.subPackageName ||
      selectedSubPackageObj?.name ||
      "";

    return { packageName, subPackageName };
  };

  const openAddForm = () => {
    setFormMode("add");
    setCurrentDependent({
      id: null,
      name: "",
      relation: "",
      age: "",
      gender: "",
      package: "",
      subPackage: "",
      subPackages: [],
      isNew: true,
    });
    setIsFormOpen(true);
  };

  const openEditForm = (dependent) => {
    setFormMode("edit");
    setCurrentDependent({
      ...dependent,
      subPackages: storedSubpackages[dependent.package] || [],
    });
    setIsFormOpen(true);
  };

  const fetchDependentSubPackages = (packageId, dependentId) => {
    const subpackagesForDependent = storedSubpackages[packageId] || [];
    setDependents((prevDependents) =>
      prevDependents.map((dep) =>
        dep.id === dependentId
          ? { ...dep, subPackages: subpackagesForDependent }
          : dep
      )
    );
  };

  const handleDependentInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDependent((prev) => ({
      ...prev,
      [name]:
        name === "package" || name === "subPackage" ? String(value) : value,
    }));

    if (name === "package") {
      setCurrentDependent((prev) => ({
        ...prev,
        subPackage: "",
        subPackages: storedSubpackages[String(value)] || [],
      }));
    }
  };

  const handleSaveDependent = () => {
    const {
      id,
      name,
      relation,
      age,
      package: pkg,
      subPackage,
      gender,
      subPackages,
    } = currentDependent;

    if (
      name.trim() === "" ||
      relation.trim() === "" ||
      age.toString().trim() === "" ||
      pkg === "" ||
      (subPackages.length > 0 && subPackage === "") ||
      gender.trim() === ""
    ) {
      alert("Please fill in all dependent fields.");
      return;
    }

    if (isNaN(age) || parseInt(age, 10) <= 0) {
      alert("Please enter a valid age for the dependent.");
      return;
    }

    const updatedDependent = {
      id: id || Date.now(),
      name,
      relation,
      age,
      gender,
      package: pkg,
      subPackage: subPackages.length > 0 ? subPackage : null,
      subPackages: subPackages,
      packageName: selectedPackageName(pkg),
      subPackageName: subPackage ? selectedSubPackageName(subPackage) : null,
      isNew: !id || !originalDependents.some((dep) => dep.id === id),
    };

    if (formMode === "add") {
      setDependents((prev) => [...prev, updatedDependent]);
    } else if (formMode === "edit") {
      setDependents((prev) =>
        prev.map((dep) =>
          dep.id === updatedDependent.id ? updatedDependent : dep
        )
      );

      if (!updatedDependent.isNew) {
        setOriginalDependents((prev) =>
          prev.map((dep) =>
            dep.id === updatedDependent.id ? updatedDependent : dep
          )
        );
      }
    }

    setIsFormOpen(false);
  };

  const handleDeleteDependent = (id) => {
    setDeleteDependentId(id);
  };

  const customSelectStyles = useMemo(
    () => ({
      control: (provided) => ({
        ...provided,
        width: "100%",
        height: "45px",
        background: "#ededed",
        boxShadow:
          "-10px -5px 5px 0px #ffffffc7 inset, 7px 7px 5px 0px #00000040 inset",
        border: "none",
        borderRadius: "20px",
        padding: "0 15px",
        fontSize: "16px",
        outline: "none",
        minHeight: "auto",
      }),
      valueContainer: (provided) => ({
        ...provided,
        padding: "0",
        height: "45px",
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
    }),
    []
  );

  const packageOptions = useMemo(
    () =>
      storedPackages.map((pkg) => ({
        label: pkg.name || pkg.packageName,
        value: String(pkg.id),
        description: pkg.description,
        descriptionList: pkg.descriptionList || [],
      })),
    [storedPackages]
  );

  const subPackageOptions = useMemo(
    () =>
      subPackages.map((subPkg) => ({
        label: subPkg.name,
        value: String(subPkg.id),
        description: subPkg.description,
        descriptionList: subPkg.descriptionList || [],
      })),
    [subPackages]
  );

  const renderDescriptionList = () => {
    let selectedItem = null;

    if (selectedSubPackage) {
      selectedItem = subPackageOptions.find(
        (option) => option.value === selectedSubPackage
      );
    } else if (selectedPackage) {
      selectedItem = packageOptions.find(
        (option) => option.value === selectedPackage
      );
    }

    if (!selectedItem || !selectedItem.descriptionList.length) return null;

    return (
      <div className={styles.packageDescription}>
        <h5>Package Details</h5>
        <ul className={styles.descriptionList}>
          {selectedItem.descriptionList.map((item, index) => (
            <li key={index} className={styles.nestedListItem}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const handleRetryPayment = () => {
    setPaymentError(null);
    setIsPaymentModalOpen(true);
  };

  const newDependents = useMemo(() => {
    return dependents.filter((dep) => dep.isNew);
  }, [dependents]);

  const requiresPayment = useMemo(() => {
    if (!initialBookingId) {
      return dependents.length > 0;
    } else {
      return newDependents.length > 0;
    }
  }, [initialBookingId, dependents, newDependents]);

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

  const saveReportDataToLocalStorage = (bookingResult) => {
    const reportData = {
      userId: bookingResult.userId,
      client_id: storedClientId,
      hr_id: storedHrId,
      patientName,
      phoneNumber,
      bookingId: bookingResult.bookingId,
      selectedPackage: bookingResult?.userDetails.selectedPackage,
      selectedSubPackage: bookingResult?.userDetails.selectedSubPackage,
      userResponse: employeeData.userResponse,
      dependents: bookingResult.dependents,
      diagnosticCenter: bookingResult?.userDetails.diagnosticCenter,
      timeslot: bookingResult?.userDetails.timeslot,
    };

    localStorage.setItem("offsiteReportData", JSON.stringify(reportData));
  };

  if (isLoading) {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.loadingContainer}>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.phoneInputBox}>
        {/* Logo */}
        <img src={checkmedLogo} alt="CheckMed Logo" className={styles.logo} />

        {/* Title */}
        <h1 className={styles.title}>CheckMed</h1>
        <div className={styles.offsiteFormContainer}>
          <div className={styles.formGroupContainer}>
            {/* Left Side - Your Details */}
            <div className={styles.leftSide}>
              <button
                onClick={() => navigate("/bookings")}
                className={styles.backButton}
              >
                ← Back
              </button>
              {/* Phone Number */}
              <div className={styles.formGroup}>
                <h5>Your Details</h5>
                <span className={styles.fieldLabel}>
                  Phone Number <span className={styles.required}>*</span> :
                </span>
                <input
                  type="text"
                  className={styles.inputField}
                  value={phoneNumber}
                  readOnly
                />
              </div>

              {/* Employee ID */}
              <div className={styles.formGroup}>
                <span className={styles.fieldLabel}>
                  Employee ID <span className={styles.required}>*</span> :
                </span>
                <input
                  type="text"
                  className={styles.inputField}
                  value={employeeData?.employeeId || ""}
                  readOnly
                />
              </div>

              {/* Name */}
              <div className={styles.formGroup}>
                <span className={styles.fieldLabel}>
                  Name <span className={styles.required}>*</span> :
                </span>
                <input
                  type="text"
                  className={styles.inputField}
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <span className={styles.fieldLabel}>
                  Email <span className={styles.required}>*</span> :
                </span>
                <input
                  type="email"
                  className={styles.inputField}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              {/* Age and Gender */}
              <div className={styles.ageGenderGroup}>
                {/* Age */}
                <div className={styles.formGroup}>
                  <span className={styles.fieldLabel}>
                    Age <span className={styles.required}>*</span> :
                  </span>
                  <input
                    type="number"
                    className={styles.inputField}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                    style={{ width: "150px" }}
                  />
                </div>

                {/* Gender */}
                <div className={styles.formGroup}>
                  <span className={styles.fieldLabel}>
                    Gender <span className={styles.required}>*</span> :
                  </span>
                  <select
                    className={styles.inputField}
                    value={selectedGender}
                    placeholder="Gender"
                    style={{ width: "150px" }}
                    onChange={(e) => {
                      setSelectedGender(e.target.value);
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Middle Side - Time */}
            <div className={styles.middleSide}>
              {/* Diagnostic Center */}
              <div className={styles.formGroup}>
                <span className={styles.fieldLabel}>
                  Diagnostic Center <span className={styles.required}>*</span> :
                </span>
                {centersLoading ? (
                  <div className={styles.loadingContainer}>
                    <p>Loading...</p>
                  </div>
                ) : (
                  <select
                    className={styles.inputField}
                    value={selectedCenter}
                    onChange={handleCenterChange}
                    disabled={diagnosticCenters.length === 0}
                  >
                    <option value="">Choose Center</option>
                    {diagnosticCenters.length > 0 ? (
                      diagnosticCenters.map((center) => (
                        <option key={center.id} value={String(center.id)}>
                          {center.name} ({center.distance.toFixed(2)} km)
                        </option>
                      ))
                    ) : (
                      <option disabled>No Centers Available</option>
                    )}
                  </select>
                )}
              </div>

              {/* Diagnostic Center Details */}
              {selectedCenterDetails && (
                <div className={styles.centerDetails}>
                  <h5>{selectedCenterDetails.name}</h5>
                  <p>{selectedCenterDetails.address}</p>
                  <p>
                    {selectedCenterDetails.city}, {selectedCenterDetails.state}{" "}
                    - {selectedCenterDetails.zipCode}
                  </p>
                  <p>Landmark: {selectedCenterDetails.landmark}</p>
                  <p>Contact: {selectedCenterDetails.contactNumber}</p>
                </div>
              )}

              {/* Preferred Collection Date & Time */}
              <div className={styles.formGroup}>
                <span className={styles.fieldLabel}>
                  Preferred Collection Date & Time{" "}
                  <span className={styles.required}>*</span> :
                </span>
                <div className={styles.dateTimeContainer}>
                  {/* Date Picker */}
                  <div className={styles.datePickerWrapper}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MUIDatePicker
                        label="Select Date"
                        value={preferredDate ? dayjs(preferredDate) : null}
                        onChange={(date) => {
                          if (date) {
                            const formattedDate = date.format("YYYY-MM-DD");
                            setPreferredDate(formattedDate);
                          } else {
                            setPreferredDate("");
                          }
                        }}
                        shouldDisableDate={disableDates}
                        minDate={dayjs().add(2, "day").startOf("day")}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            className={styles.datePickerInput}
                            placeholder="Select Date"
                          />
                        )}
                        fullWidth
                      />
                    </LocalizationProvider>
                  </div>

                  {/* Time Slot Picker */}
                  <div className={styles.timeSlotWrapper}>
                    <TextField
                      select
                      label="Time Slot"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      variant="outlined"
                      fullWidth
                      className={styles.timeSlotField}
                    >
                      <MenuItem value="">
                        <em>Select Time Slot</em>
                      </MenuItem>
                      {timeSlots.map((slot) => (
                        <MenuItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Package & Dependents */}
            <div className={styles.rightSide}>
              {/* Package Selection */}
              <div className={styles.formGroup}>
                <span className={styles.fieldLabel}>
                  Package <span className={styles.required}>*</span> :
                </span>
                <Select
                  options={packageOptions}
                  value={packageOptions.find(
                    (option) => option.value === selectedPackage
                  )}
                  getOptionLabel={(option) => option.label}
                  onChange={(selectedOption) => {
                    handlePackageChange(selectedOption.value);
                  }}
                  components={{ Option: CustomOption }}
                  placeholder="Select Package"
                  isDisabled={formSubmitting}
                  styles={customSelectStyles}
                  classNamePrefix="react-select"
                />
              </div>

              {/* Sub-Package Selection */}
              {subPackages.length > 0 && (
                <div className={styles.formGroup}>
                  <span className={styles.fieldLabel}>
                    Sub-Package <span className={styles.required}>*</span> :
                  </span>
                  <Select
                    options={subPackageOptions}
                    value={subPackageOptions.find(
                      (option) => option.value === selectedSubPackage
                    )}
                    onChange={(selectedOption) =>
                      handleSubPackageChange(selectedOption.value)
                    }
                    components={{ Option: CustomOption }}
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

              {/* Render Description List */}
              {renderDescriptionList()}

              {/* Dependents Section */}
              <div className={styles.dependentsContainer}>
                {dependents.length > 0 && (
                  <h5 className={styles.dependentsHeader}>DEPENDENT DETAILS</h5>
                )}
                {dependentsLoading && <p>Loading dependents...</p>}
                {dependentsError && (
                  <p className={styles.errorText}>{dependentsError}</p>
                )}

                {!dependentsLoading &&
                  dependents.length > 0 &&
                  dependents.map((dep) => (
                    <div key={dep.id} className={styles.dependentCard}>
                      <div
                        className={styles.dependentInfo}
                        onClick={() => openEditForm(dep)}
                      >
                        <span className={styles.dependentName}>{dep.name}</span>
                        <span className={styles.dependentDetails}>
                          {dep.relation}, Age: {dep.age}
                        </span>
                      </div>
                      <button
                        className={styles.deleteDependentBtn}
                        onClick={() => handleDeleteDependent(dep.id)}
                        aria-label={`Delete dependent ${dep.name}`}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <button
                  className={styles.confirmBtn}
                  onClick={async () => {
                    const error = validateFields();
                    const dependentError = validateDependents();

                    if (error || dependentError) {
                      setValidationError(error || dependentError);
                    } else {
                      if (requiresPayment) {
                        handlePayAndBookClick();
                      } else {
                        const bookingResult = await handleNextClick();
                        if (bookingResult) {
                          // Clear form data from localStorage after successful booking
                          clearFormData();

                          // Save report data to localStorage
                          saveReportDataToLocalStorage(bookingResult);

                          navigate("/offsite-reports", {
                            state: bookingResult.userDetails,
                            replace: true,
                          });
                        }
                      }
                    }
                  }}
                  disabled={formSubmitting || centersLoading}
                >
                  {formSubmitting
                    ? "Processing..."
                    : requiresPayment
                    ? "Pay and Book"
                    : "Book"}
                </button>
                {requiresPayment && (
                  <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={closePaymentModal}
                    serviceType="Offsite"
                    dependentsCount={
                      !initialBookingId
                        ? dependents.length
                        : newDependents.length
                    }
                    pricePerDependent={2500}
                    basePrice={0}
                    onProceedToPay={handleProceedToPay}
                    totalAmount={
                      (!initialBookingId
                        ? dependents.length
                        : newDependents.length) * 2500
                    }
                    dependentsDetails={
                      !initialBookingId ? dependents : newDependents
                    }
                    paymentError={paymentError}
                    onRetry={handleRetryPayment}
                  />
                )}
                <div className={styles.dependentButtonContainer}>
                  <button
                    className={styles.dependentBtn}
                    onClick={openAddForm}
                    ref={addButtonRef}
                  >
                    + Add Dependent
                  </button>
                  {/* Dependent Form Modal */}
                  {isFormOpen && (
                    <div className={styles.modalOverlay}>
                      <div className={styles.modalContent} ref={formRef}>
                        <h3>
                          {formMode === "add"
                            ? "Add Dependent"
                            : "Edit Dependent"}
                        </h3>
                        {/* Dependent Name */}
                        <div className={styles.formGroup}>
                          <span className={styles.fieldLabel}>
                            Name <span className={styles.required}>*</span> :
                          </span>
                          <input
                            type="text"
                            className={styles.inputField}
                            name="name"
                            value={currentDependent.name}
                            onChange={handleDependentInputChange}
                            placeholder="Enter dependent's name"
                          />
                        </div>
                        {/* Dependent Relation */}
                        <div className={styles.formGroup}>
                          <span className={styles.fieldLabel}>
                            Relation <span className={styles.required}>*</span>{" "}
                            :
                          </span>
                          <input
                            type="text"
                            className={styles.inputField}
                            name="relation"
                            value={currentDependent.relation}
                            onChange={handleDependentInputChange}
                            placeholder="Enter relation"
                          />
                        </div>
                        {/* Dependent Age and Gender */}
                        <div className={styles.ageGenderGroup}>
                          {/* Age */}
                          <div className={styles.formGroup}>
                            <span className={styles.fieldLabel}>
                              Age <span className={styles.required}>*</span> :
                            </span>
                            <input
                              type="number"
                              className={styles.inputField}
                              name="age"
                              value={currentDependent.age}
                              onChange={handleDependentInputChange}
                              placeholder="Enter age"
                              style={{ width: "120px" }}
                            />
                          </div>

                          {/* Gender */}
                          <div className={styles.formGroup}>
                            <span className={styles.fieldLabel}>
                              Gender <span className={styles.required}>*</span>{" "}
                              :
                            </span>
                            <select
                              className={styles.inputField}
                              name="gender"
                              placeholder="Gender"
                              value={currentDependent.gender}
                              style={{ width: "120px" }}
                              onChange={handleDependentInputChange}
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                        {/* Dependent Package */}
                        <div className={styles.formGroup}>
                          <span className={styles.fieldLabel}>
                            Package <span className={styles.required}>*</span> :
                          </span>
                          <select
                            className={styles.inputField}
                            name="package"
                            value={currentDependent.package}
                            onChange={handleDependentInputChange}
                          >
                            <option value="">Select Package</option>
                            {storedPackages.length > 0 ? (
                              storedPackages.map((pkg) => (
                                <option key={pkg.id} value={String(pkg.id)}>
                                  {pkg.name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No Packages Available</option>
                            )}
                          </select>
                        </div>
                        {/* Dependent Sub-Package */}
                        {currentDependent.subPackages.length > 0 && (
                          <div className={styles.formGroup}>
                            <span className={styles.fieldLabel}>
                              Sub-Package{" "}
                              <span className={styles.required}>*</span> :
                            </span>
                            <Select
                              options={currentDependent.subPackages.map(
                                (subPkg) => ({
                                  label: subPkg.name,
                                  value: String(subPkg.id),
                                  description: subPkg.description,
                                  descriptionList: subPkg.descriptionList || [],
                                })
                              )}
                              value={currentDependent.subPackages.find(
                                (option) =>
                                  option.value === currentDependent.subPackage
                              )}
                              onChange={(selectedOption) =>
                                setCurrentDependent((prev) => ({
                                  ...prev,
                                  subPackage: selectedOption.value,
                                }))
                              }
                              components={{ Option: CustomOption }}
                              placeholder="Select Sub-Package"
                              isDisabled={
                                !currentDependent.package ||
                                currentDependent.subPackages.length === 0
                              }
                              styles={customSelectStyles}
                              classNamePrefix="react-select"
                            />
                          </div>
                        )}
                        {/* Form Buttons */}
                        <div className={styles.formButtons}>
                          <button
                            className={styles.confirmBtn}
                            onClick={handleSaveDependent}
                          >
                            Save
                          </button>
                          <button
                            className={styles.dependentBtn}
                            onClick={() => setIsFormOpen(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coordinates Error Modal */}
            {coordinatesError && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h3>Data Error</h3>
                  <p>{coordinatesError}</p>
                  <button
                    className={styles.confirmBtn}
                    onClick={() => setCoordinatesError(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Validation Error Modal */}
            {validationError && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h3>Error</h3>
                  <p>{validationError}</p>
                  <button
                    className={styles.confirmBtn}
                    onClick={() => setValidationError(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Delete Dependent Confirmation Modal */}
            {deleteDependentId && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h3>Confirm Deletion</h3>
                  <p>Are you sure you want to delete this dependent?</p>
                  <div className={styles.modalButtons}>
                    <button
                      className={styles.confirmBtn}
                      onClick={() => {
                        setDependents((prev) =>
                          prev.filter((dep) => dep.id !== deleteDependentId)
                        );
                        setDeleteDependentId(null);
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className={styles.dependentBtn}
                      onClick={() => setDeleteDependentId(null)}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
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

export default OffsiteFormPage;
