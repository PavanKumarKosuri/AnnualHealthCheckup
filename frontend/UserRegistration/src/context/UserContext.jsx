/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../api/apiService.js";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState(
    localStorage.getItem("phoneNumber") || ""
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [employeeId, setEmployeeId] = useState(
    localStorage.getItem("employeeId") || null
  );
  const [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem("isAdmin")) || false
  );
  const [employeeData, setEmployeeData] = useState(
    JSON.parse(localStorage.getItem("employeeData")) || null
  );
  const [selectedSampleType, setSelectedSampleType] = useState(
    localStorage.getItem("selectedSampleType") || ""
  );
  const [packageData, setPackageData] = useState({
    packages: JSON.parse(localStorage.getItem("packages")) || [],
    subpackages: JSON.parse(localStorage.getItem("subpackages")) || {},
  });
  const [clientData, setClientData] = useState(
    JSON.parse(localStorage.getItem("clientData")) || null
  );
  const [bookings, setBookings] = useState(
    JSON.parse(localStorage.getItem("bookings")) || {
      previous: [],
      upcoming: [],
    }
  );
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem("phoneNumber", phoneNumber);
  }, [phoneNumber]);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("employeeId", employeeId);
  }, [employeeId]);

  useEffect(() => {
    localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem("employeeData", JSON.stringify(employeeData));
  }, [employeeData]);

  useEffect(() => {
    localStorage.setItem("selectedSampleType", selectedSampleType);
  }, [selectedSampleType]);

  useEffect(() => {
    localStorage.setItem("packages", JSON.stringify(packageData.packages));
    localStorage.setItem(
      "subpackages",
      JSON.stringify(packageData.subpackages)
    );
  }, [packageData]);

  useEffect(() => {
    localStorage.setItem("clientData", JSON.stringify(clientData));
  }, [clientData]);

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const fetchClientData = useCallback(async (clientId) => {
    try {
      const response = await api.get(`/clients/client/${clientId}`);
      setClientData(response.data);
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  }, []);

  const fetchUserBookings = useCallback(async (employeeId) => {
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const response = await api.get(`/users/${employeeId}/bookings`);
      const bookingsData = response.data;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const previous = bookingsData.filter((booking) => {
        if (!booking.bookingDate) return false;
        return new Date(booking.bookingDate) < today;
      });

      const upcoming = bookingsData.filter((booking) => {
        if (!booking.bookingDate) return false;
        return new Date(booking.bookingDate) >= today;
      });

      const updatedBookings = {
        previous: previous,
        upcoming: upcoming,
      };

      setBookings(updatedBookings);
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookingsError("Failed to load bookings. Please try again later.");
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  const handlePhoneNumberSubmit = async (number) => {
    setPhoneNumber(number);
  };

  const clearAllData = () => {
    const keysToRemove = [
      "phoneNumber",
      "userData",
      "userId",
      "employeeId",
      "isAdmin",
      "employeeData",
      "selectedSampleType",
      "packages",
      "subpackages",
      "clientData",
      "bookings",
      "client",
      "hr_id",
      "raw_clientId",
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Reset state variables
    setPhoneNumber("");
    setUserData(null);
    setUserId(null);
    setEmployeeId(null);
    setIsAdmin(false);
    setEmployeeData(null);
    setSelectedSampleType("");
    setPackageData({
      packages: [],
      subpackages: {},
    });
    setClientData(null);
    setBookings({
      previous: [],
      upcoming: [],
    });
    setBookingsLoading(false);
    setBookingsError(null);
  };

  const handleEmployeeVerification = useCallback(
    async (employeeId) => {
      try {
        const verificationResponse = await api.get(
          `/users/verify-employee?employeeId=${employeeId}&phoneNumber=${phoneNumber}`
        );

        if (verificationResponse.data.isValid) {
          const { name, email, age, gender } = verificationResponse.data;

          try {
            const userResponse = await api.get(
              `/users/get-user-by-employee-id?employeeId=${employeeId}`
            );

            if (userResponse.data) {
              const newEmployeeData = {
                userResponse: userResponse.data,
                employeeName: name,
                employeeId: employeeId,
                emailId: email,
                age: age,
                gender: gender,
              };
              setEmployeeData(newEmployeeData);
              setUserData(userResponse.data);
              setEmployeeId(employeeId);
              setUserId(userResponse.data.id);
              fetchUserBookings(employeeId);
            } else {
              const newEmployeeData = {
                userResponse: {},
                employeeName: name,
                employeeId: employeeId,
                emailId: email,
                age: age,
                gender: gender,
              };
              setEmployeeData(newEmployeeData);
              setUserData(userResponse.data);
            }

            return { success: true };
          } catch (userError) {
            if (userError.response && userError.response.status === 404) {
              const newEmployeeData = {
                userResponse: {},
                employeeName: name,
                employeeId: employeeId,
                emailId: email,
                age: age,
                gender: gender,
              };
              setEmployeeData(newEmployeeData);
              return { success: true };
            } else {
              console.error("Error fetching user data:", userError);
              return {
                success: false,
                message: "An error occurred while fetching user data.",
              };
            }
          }
        } else {
          return {
            success: false,
            message:
              "Dear Employee, we regret to inform you are not eligible for this year's Annual Health Checkup at this time. Please ensure that the phone number and Employee ID you entered are correctly registered within your company's records. For any further assistance or clarification, kindly contact your HR department.",
          };
        }
      } catch (error) {
        console.error("Error validating employee ID:", error);
        return {
          success: false,
          message: "An error occurred. Please try again.",
        };
      }
    },
    [fetchUserBookings, phoneNumber]
  );

  const handleSampleTypeSelection = (type) => {
    setSelectedSampleType(type);
  };

  const handlePackageData = useCallback(
    async (clientId, retries = 3, delay = 1000) => {
      try {
        const cachedPackages = localStorage.getItem("packages");
        const cachedSubpackages = localStorage.getItem("subpackages");
        if (cachedPackages && cachedSubpackages) {
          const parsedPackages = JSON.parse(cachedPackages);
          const parsedSubpackages = JSON.parse(cachedSubpackages);

          if (
            parsedPackages.length > 0 &&
            Object.keys(parsedSubpackages).length > 0
          ) {
            setPackageData({
              packages: parsedPackages,
              subpackages: parsedSubpackages,
            });
            return;
          }
        }
        const raw_clientId = localStorage.getItem("raw_clientId");
        const packagesResponse = await api.get(
          `/packages/clients/${raw_clientId}/packages`
        );
        const fetchedPackages = packagesResponse.data;
        setPackageData((prev) => ({
          ...prev,
          packages: fetchedPackages,
        }));
        localStorage.setItem("packages", JSON.stringify(fetchedPackages));

        const subpackagesByPackage = {};
        const subpackagePromises = fetchedPackages.map((pkg) =>
          api.get(`/subpackages/packages/${pkg.id}`).then((res) => {
            subpackagesByPackage[pkg.id] = res.data;
          })
        );

        await Promise.all(subpackagePromises);

        setPackageData((prev) => ({
          ...prev,
          subpackages: subpackagesByPackage,
        }));
        localStorage.setItem(
          "subpackages",
          JSON.stringify(subpackagesByPackage)
        );
      } catch (error) {
        if (error.response && error.response.status === 429 && retries > 0) {
          console.warn(
            `Rate limited. Retrying in ${delay}ms... (${retries} retries left)`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          return handlePackageData(clientId, retries - 1, delay * 2);
        }
        console.error("Error fetching packages and subpackages:", error);
      }
    },
    []
  );

  const updateBooking = useCallback(
    async (bookingId, updatedData) => {
      try {
        const response = await api.put(`/users/${bookingId}`, updatedData);

        if (employeeId) {
          fetchUserBookings(employeeId);
        }
        return { success: true };
      } catch (error) {
        console.error("Error updating booking:", error);
        return { success: false, message: "Failed to update booking." };
      }
    },
    [fetchUserBookings, employeeId]
  );

  const deleteBooking = useCallback(
    async (bookingId) => {
      try {
        const response = await api.delete(`users/bookings/${bookingId}`);

        if (employeeId) {
          fetchUserBookings(employeeId);
        }
        return { success: true };
      } catch (error) {
        console.error("Error deleting booking:", error);
        return { success: false, message: "Failed to delete booking." };
      }
    },
    [fetchUserBookings, employeeId]
  );

  return (
    <UserContext.Provider
      value={{
        phoneNumber,
        setPhoneNumber,
        userData,
        setUserData,
        userId,
        setUserId,
        isAdmin,
        setIsAdmin,
        handlePhoneNumberSubmit,
        employeeData,
        handleEmployeeVerification,
        selectedSampleType,
        handleSampleTypeSelection,
        packageData,
        handlePackageData,
        employeeId,
        bookings,
        bookingsLoading,
        bookingsError,
        fetchUserBookings,
        updateBooking,
        deleteBooking,
        fetchClientData,
        clientData,
        clearAllData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
