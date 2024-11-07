import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import { UserContext } from "../../context/UserContext.jsx";
import CustomOption from "../../components/CustomOption/CustomOption.jsx";
import api from "../../api/apiService.js";
import styles from "./HomeCollectionFormPage.module.css";
import checkmedLogo from "../../assets/checkmedLogo.png";
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

const HomeCollectionFormPage = () => {
  const navigate = useNavigate();
  const {
    phoneNumber,
    userData,
    employeeData,
    packageData,
    handlePackageData,
    fetchUserBookings,
  } = useContext(UserContext);

  const location = useLocation();

  const initialBookingId = location.state?.bookingId || null;

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
    const trimmedGender = gender.trim().toLowerCase();
    if (trimmedGender === "male") return "Male";
    if (trimmedGender === "female") return "Female";
    return "Other";
  };

  const [selectedPackage, setSelectedPackage] = useState(
    localStorage.getItem("selectedPackage") || userData?.package || null
  );
  const [selectedSubPackage, setSelectedSubPackage] = useState(
    localStorage.getItem("selectedSubPackage") || userData?.subPackage || null
  );
  const [subPackages, setSubPackages] = useState([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [address, setAddress] = useState(
    JSON.parse(localStorage.getItem("address")) || {
      streetAddress: "",
      cityAddress: "",
      stateAddress: "",
      zipCode: "",
      landmark: "",
    }
  );
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    streetAddress: "",
    cityAddress: "",
    stateAddress: "",
    zipCode: "",
    landmark: "",
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [preferredVendor, setPreferredVendor] = useState(
    localStorage.getItem("preferredVendor") || ""
  );
  const [preferredLanguage, setPreferredLanguage] = useState(
    localStorage.getItem("preferredLanguage") || ""
  );
  const [consent, setConsent] = useState(
    localStorage.getItem("consent") === "true" || false
  );
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
    isNew: true,
  });
  const [preferredDate, setPreferredDate] = useState(
    localStorage.getItem("preferredDate") || ""
  );
  const [preferredTime, setPreferredTime] = useState(
    localStorage.getItem("preferredTime") || ""
  );
  const [vendors, setVendors] = useState([]);
  const [dependentsLoading, setDependentsLoading] = useState(false);
  const [dependentsError, setDependentsError] = useState(null);
  const addButtonRef = useRef(null);
  const formRef = useRef(null);
  const addressFormRef = useRef(null);

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
    localStorage.setItem("address", JSON.stringify(address));
  }, [address]);

  useEffect(() => {
    localStorage.setItem("preferredDate", preferredDate);
  }, [preferredDate]);

  useEffect(() => {
    localStorage.setItem("preferredTime", preferredTime);
  }, [preferredTime]);

  useEffect(() => {
    localStorage.setItem("preferredVendor", preferredVendor);
  }, [preferredVendor]);

  useEffect(() => {
    localStorage.setItem("preferredLanguage", preferredLanguage);
  }, [preferredLanguage]);

  useEffect(() => {
    localStorage.setItem("consent", consent);
  }, [consent]);

  useEffect(() => {
    localStorage.setItem("dependents", JSON.stringify(dependents));
  }, [dependents]);

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentError(null);
  };

  const selectedPackageName = (packageId) => {
    const pkg = storedPackages.find((p) => p.id === Number(packageId));
    return pkg ? pkg.name || pkg.packageName : "";
  };

  const selectedSubPackageName = (subPackageId) => {
    for (const pkgId in storedSubpackages) {
      const subPkg = storedSubpackages[pkgId].find(
        (sp) => sp.id === Number(subPackageId)
      );
      if (subPkg) return subPkg.name || subPkg.subPackageName;
    }
    return "";
  };

  const handleProceedToPay = async () => {
    setPaymentError(null);
    let userIdLocal = null;
    try {
      let bookingId = initialBookingId;
      let bookingResult = null;

      bookingResult = await handleNextClick();

      if (!bookingResult) {
        throw new Error("Failed to create or update booking.");
      }

      userIdLocal = bookingResult.userId;
      bookingId = bookingResult.bookingId;

      let dependentsToPayFor = [];

      if (!initialBookingId) {
        dependentsToPayFor = dependents;
      } else {
        dependentsToPayFor = newDependents;
      }

      const totalAmount = dependentsToPayFor.length * 2500;

      if (dependentsToPayFor.length === 0) {
        clearFormData();

        saveReportDataToLocalStorage(bookingResult);
        await fetchUserBookings(employeeData.employeeId);
        navigate("/homecollection-reports", {
          state: bookingResult.userDetails,
          replace: true,
        });
      } else {
        const dependentsIds = dependentsToPayFor.map((dep) => dep.id);

        await initiateRazorpayPayment(
          userIdLocal,
          dependentsIds,
          bookingId,
          totalAmount,
          async () => {
            try {
              await api.put(`/home-collections/${userIdLocal}`, {
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
                          user_id: userIdLocal,
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
                      user_id: userIdLocal,
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

              clearFormData();

              saveReportDataToLocalStorage(bookingResult);

              navigate("/homecollection-reports", {
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
            if (!initialBookingId && userIdLocal) {
              try {
                await api.delete(`/users/${userIdLocal}`);
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
      if (!initialBookingId && userIdLocal) {
        try {
          await api.delete(`/users/${userIdLocal}`);
        } catch (deleteError) {
          console.error(
            "Error deleting user after payment failure:",
            deleteError
          );
        }
      }
    }
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
      !address.streetAddress ||
      !address.cityAddress ||
      !address.stateAddress ||
      !address.zipCode ||
      preferredDate.trim() === "" ||
      preferredTime.trim() === "" ||
      preferredVendor.trim() === "" ||
      !consent
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
        (pkg) => pkg.id === Number(bookingDataResponse.user.package)
      );

      if (selectedPackageOption) {
        setSelectedPackage(selectedPackageOption.id);
        localStorage.setItem("selectedPackage", selectedPackageOption.id);
      }
      setSelectedSubPackage(bookingDataResponse.user.subPackage || null);
      localStorage.setItem(
        "selectedSubPackage",
        bookingDataResponse.user.subPackage || ""
      );

      if (bookingDataResponse.homeCollection) {
        const addressData = {
          streetAddress: bookingDataResponse.homeCollection.streetAddress || "",
          cityAddress: bookingDataResponse.homeCollection.cityAddress || "",
          stateAddress: bookingDataResponse.homeCollection.stateAddress || "",
          zipCode: bookingDataResponse.homeCollection.zipCode || "",
          landmark: bookingDataResponse.homeCollection.landmark || "",
        };
        setAddress(addressData);
        localStorage.setItem("address", JSON.stringify(addressData));

        const preferredDateValue = bookingDataResponse.homeCollection
          .scheduledDate
          ? dayjs(bookingDataResponse.homeCollection.scheduledDate).format(
              "YYYY-MM-DD"
            )
          : "";
        setPreferredDate(preferredDateValue);
        localStorage.setItem("preferredDate", preferredDateValue);

        const preferredTimeValue =
          bookingDataResponse.homeCollection.scheduledTime.slice(0, 5) || "";
        setPreferredTime(preferredTimeValue);
        localStorage.setItem("preferredTime", preferredTimeValue);

        setPreferredVendor(
          bookingDataResponse.homeCollection.preferredVendor || ""
        );
        localStorage.setItem(
          "preferredVendor",
          bookingDataResponse.homeCollection.preferredVendor || ""
        );

        setPreferredLanguage(
          bookingDataResponse.homeCollection.preferredLanguage || ""
        );
        localStorage.setItem(
          "preferredLanguage",
          bookingDataResponse.homeCollection.preferredLanguage || ""
        );
      }

      const formattedDependents = bookingDataResponse.dependents.map((dep) => ({
        id: dep.id,
        name: dep.name,
        relation: dep.relationship || dep.relation,
        age: dep.age,
        gender: dep.gender,
        package: dep.package,
        subPackage: dep.subPackage,
        bookingId: dep.bookingId,
        subPackages: storedSubpackages[dep.package] || [],
        packageName: selectedPackageName(dep.package),
        subPackageName: selectedSubPackageName(dep.subPackage),
        isNew: false,
      }));

      setDependents(formattedDependents);
      setOriginalDependents(formattedDependents);

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
        package: dep.package,
        subPackage: dep.subPackage,
        subPackages: storedSubpackages[dep.package] || [],
        packageName: selectedPackageName(dep.package),
        subPackageName: selectedSubPackageName(dep.subPackage),
        isNew: false,
      }));

      setDependents(fetchedDependents);
      setOriginalDependents(fetchedDependents);

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
        (pkg) => pkg.id === bookingData.user.package
      );
      if (selectedPackageOption) {
        setSelectedPackage(selectedPackageOption.id);
      }
    }
  }, [bookingData, storedPackages]);

  const timeSlots = useMemo(
    () => [
      { label: "5:00 AM - 6:00 AM", value: "05:00" },
      { label: "6:00 AM - 7:00 AM", value: "06:00" },
      { label: "7:00 AM - 8:00 AM", value: "07:00" },
      { label: "8:00 AM - 9:00 AM", value: "08:00" },
      { label: "9:00 AM - 10:00 AM", value: "09:00" },
      { label: "10:00 AM - 11:00 AM", value: "10:00" },
      { label: "11:00 AM - 12:00 PM", value: "11:00" },
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

  useEffect(() => {
    const subpackagesForSelectedPackage =
      storedSubpackages[selectedPackage] || [];
    setSubPackages(subpackagesForSelectedPackage);
    setSelectedSubPackage(null);
  }, [selectedPackage, storedSubpackages]);

  const handlePackageChange = (packageId) => {
    setSelectedPackage(packageId);
    setSelectedSubPackage(null);
  };

  const handleSubPackageChange = (subPackageId) => {
    setSelectedSubPackage(subPackageId);
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
        collection_type: "home",
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
      const userIdLocal = response.data.userId;

      // localStorage.setItem("bookingId", newBookingId);
      const homeCollectionData = {
        userId: userIdLocal,
        streetAddress: address.streetAddress,
        cityAddress: address.cityAddress,
        stateAddress: address.stateAddress,
        zipCode: address.zipCode,
        landmark: address.landmark,
        scheduledDate: preferredDate,
        scheduledTime: preferredTime,
        preferredVendor,
        preferredLanguage,
        dependents_count: dependents.length,
      };

      if (bookingData) {
        await api.put(`/home-collections/${userIdLocal}`, homeCollectionData);
      } else {
        await api.post("/home-collections", homeCollectionData);
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
                user_id: userIdLocal,
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

      return {
        userId: userIdLocal,
        bookingId: newBookingId,
        dependents,
        userDetails: {
          userId: userIdLocal,
          client_id: storedClientId,
          hr_id: storedHrId,
          patientName,
          phoneNumber,
          bookingId: newBookingId,
          selectedPackage: packageName,
          selectedSubPackage: subPackageName,
          userResponse: employeeData.userResponse,
          dependents,
          address,
          collectionPreferences: {
            preferredDate,
            preferredTime,
            preferredVendor,
            preferredLanguage,
          },
          timeSlot: timeSlot,
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
        name === "package" || name === "subPackage" ? Number(value) : value,
    }));

    if (name === "package") {
      setCurrentDependent((prev) => ({
        ...prev,
        subPackage: "",
        subPackages: storedSubpackages[Number(value)] || [],
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
        value: pkg.id,
        description: pkg.description,
        descriptionList: pkg.descriptionList || [],
      })),
    [storedPackages]
  );

  const subPackageOptions = useMemo(
    () =>
      subPackages.map((subPkg) => ({
        label: subPkg.name,
        value: subPkg.id,
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

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get("/vendors");
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        alert("Failed to load vendors. Please try again.");
      }
    };

    fetchVendors();
  }, []);

  const openAddressModal = () => {
    setAddressForm(address);
    setAddressErrors({});
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateAddress = () => {
    const errors = {};
    if (!addressForm.streetAddress.trim()) {
      errors.streetAddress = "Street Address is required.";
    }
    if (!addressForm.cityAddress.trim()) {
      errors.cityAddress = "City is required.";
    }
    if (!addressForm.stateAddress.trim()) {
      errors.stateAddress = "State/Province is required.";
    }
    if (!addressForm.zipCode.trim()) {
      errors.zipCode = "Zip/Postal Code is required.";
    } else {
      const zipRegex = /^\d{6}$/;
      if (!zipRegex.test(addressForm.zipCode.trim())) {
        errors.zipCode =
          "Invalid Zip/Postal Code. Please enter a 6-digit PIN code.";
      }
    }
    return errors;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const trimmedAddressForm = {
      ...addressForm,
      zipCode: addressForm.zipCode.trim(),
    };
    const errors = validateAddress();
    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }
    setAddress(trimmedAddressForm);
    setIsAddressModalOpen(false);
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
    localStorage.removeItem("address");
    localStorage.removeItem("preferredDate");
    localStorage.removeItem("preferredTime");
    localStorage.removeItem("preferredVendor");
    localStorage.removeItem("preferredLanguage");
    localStorage.removeItem("consent");
    localStorage.removeItem("dependents");
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
      address: bookingResult.userDetails.address,
      collectionPreferences: bookingResult.collectionPreferences,
      timeslot: bookingResult.userDetails.timeSlot,
    };

    localStorage.setItem("homeReportData", JSON.stringify(reportData));
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
        <div className={styles.homeCollectionFormContainer}>
          <div className={styles.formGroupContainer}>
            {/* Left Side - Patient Details */}
            <div className={styles.leftSide}>
              <button
                onClick={() => navigate("/bookings")}
                className={styles.backButton}
              >
                ← Back
              </button>
              {/* Your Details */}
              <div className={styles.formGroup}>
                <h5>YOUR DETAILS</h5>
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
                  Personal Email <span className={styles.required}>*</span> :
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
                    onChange={(e) => setSelectedGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Middle Side - Address Details */}
            <div className={styles.middleSide}>
              {/* Address */}
              <div className={styles.formGroup}>
                <span className={styles.fieldLabel}>
                  Address <span className={styles.required}>*</span> :
                </span>
                {address.streetAddress ? (
                  <div
                    className={styles.addressCard}
                    onClick={openAddressModal}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") openAddressModal();
                    }}
                  >
                    <div className={styles.addressInfo}>
                      <p>{address.streetAddress}</p>
                      <p>
                        {address.cityAddress}, {address.stateAddress} -{" "}
                        {address.zipCode}
                      </p>
                      {address.landmark && <p>Landmark: {address.landmark}</p>}
                    </div>
                    <button
                      type="button"
                      className={styles.editAddressBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddressModal();
                      }}
                      aria-label="Edit Address"
                    >
                      ✎
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={styles.confirmBtn}
                    onClick={openAddressModal}
                  >
                    + Add Address
                  </button>
                )}
              </div>

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

              {/* Preferred Collection Vendor */}
              <div className={styles.formGroup}>
                <span className={styles.fieldLabel}>
                  Preferred Collection Vendor{" "}
                  <span className={styles.required}>*</span> :
                </span>
                <select
                  className={styles.inputField}
                  value={preferredVendor}
                  onChange={(e) => setPreferredVendor(e.target.value)}
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.name}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Language */}
              <div className={styles.formGroup}>
                <span className={styles.fieldLabel}>Preferred Language :</span>
                <select
                  className={styles.inputField}
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Right Side - Consent, Packages/Sub-Packages, and Dependents */}
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

              {/* Consent Checkbox */}
              <div className={styles.consentGroup}>
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <label htmlFor="consent">
                  I agree to the terms and conditions for the Annual Health
                  Checkup.
                  <span className={styles.required}>*</span>
                </label>
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
                          clearFormData();

                          saveReportDataToLocalStorage(bookingResult);

                          navigate("/homecollection-reports", {
                            state: bookingResult.userDetails,
                            replace: true,
                          });
                        }
                      }
                    }
                  }}
                  disabled={formSubmitting}
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
                    serviceType="Home Collection"
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
                                <option key={pkg.id} value={pkg.id}>
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
                                  value: subPkg.id,
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

                {/* Address Modal */}
                {isAddressModalOpen && (
                  <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} ref={addressFormRef}>
                      <h2>Enter Address Details</h2>
                      <form onSubmit={handleAddressSubmit}>
                        <div className={styles.formGroup}>
                          <span className={styles.fieldLabel}>
                            Street Address{" "}
                            <span className={styles.required}>*</span> :
                          </span>
                          <input
                            type="text"
                            name="streetAddress"
                            className={styles.inputField}
                            value={addressForm.streetAddress}
                            onChange={handleAddressInputChange}
                            placeholder="Enter your street address"
                          />
                          {addressErrors.streetAddress && (
                            <span className={styles.errorText}>
                              {addressErrors.streetAddress}
                            </span>
                          )}
                        </div>
                        <div className={styles.formGroup}>
                          <span className={styles.fieldLabel}>
                            City <span className={styles.required}>*</span> :
                          </span>
                          <input
                            type="text"
                            name="cityAddress"
                            className={styles.inputField}
                            value={addressForm.cityAddress}
                            onChange={handleAddressInputChange}
                            placeholder="Enter your city"
                          />
                          {addressErrors.cityAddress && (
                            <span className={styles.errorText}>
                              {addressErrors.cityAddress}
                            </span>
                          )}
                        </div>
                        <div className={styles.formGroup}>
                          <span className={styles.fieldLabel}>
                            State/Province{" "}
                            <span className={styles.required}>*</span> :
                          </span>
                          <input
                            type="text"
                            name="stateAddress"
                            className={styles.inputField}
                            value={addressForm.stateAddress}
                            onChange={handleAddressInputChange}
                            placeholder="Enter your state/province"
                          />
                          {addressErrors.stateAddress && (
                            <span className={styles.errorText}>
                              {addressErrors.stateAddress}
                            </span>
                          )}
                        </div>
                        <div className={styles.formGroup}>
                          <span className={styles.fieldLabel}>
                            Zip/Postal Code{" "}
                            <span className={styles.required}>*</span> :
                          </span>
                          <input
                            type="text"
                            name="zipCode"
                            className={styles.inputField}
                            value={addressForm.zipCode}
                            onChange={handleAddressInputChange}
                            placeholder="Enter your Zip/Postal Code"
                            maxLength="6"
                            pattern="\d{6}"
                            title="Please enter a 6-digit PIN code."
                          />
                          {addressErrors.zipCode && (
                            <span className={styles.errorText}>
                              {addressErrors.zipCode}
                            </span>
                          )}
                          <small className={styles.helperText}>
                            Enter a 6-digit PIN code (e.g., 110001).
                          </small>
                        </div>
                        <div className={styles.formGroup}>
                          <span className={styles.fieldLabel}>
                            Landmark/Reference Point :
                          </span>
                          <input
                            type="text"
                            name="landmark"
                            className={styles.inputField}
                            value={addressForm.landmark}
                            onChange={handleAddressInputChange}
                            placeholder="Enter a landmark or reference point"
                          />
                        </div>
                        <div className={styles.modalButtons}>
                          <button type="submit" className={styles.confirmBtn}>
                            Save
                          </button>
                          <button
                            type="button"
                            className={styles.dependentBtn}
                            onClick={closeAddressModal}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Validation Error Modal */}
                {validationError && (
                  <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                      <h2>Error</h2>
                      <p>{validationError}</p>
                      <button
                        onClick={() => setValidationError(null)}
                        className={styles.confirmBtn}
                      >
                        Ok
                      </button>
                    </div>
                  </div>
                )}

                {/* Delete Dependent Confirmation Modal */}
                {deleteDependentId && (
                  <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                      <h2>Confirm Deletion</h2>
                      <p>Are you sure you want to delete this dependent?</p>
                      <div className={styles.modalButtons}>
                        <button
                          onClick={() => {
                            setDependents((prev) =>
                              prev.filter((dep) => dep.id !== deleteDependentId)
                            );
                            setDeleteDependentId(null);
                          }}
                          className={styles.confirmBtn}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteDependentId(null)}
                          className={styles.dependentBtn}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
    </div>
  );
};

export default HomeCollectionFormPage;
