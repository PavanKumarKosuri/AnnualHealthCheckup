/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import api from "../../api/apiService";

const OnsiteRegs = () => {
  const [userData, setUserData] = useState({
    phoneNumber: "",
    patientName: "",
    employeeId: "",
    email: "",
    age: "",
    gender: "Male",
    package: "",
    subPackage: "",
    bookingId: "",
    reportsTaken: 0,
    additionalInfo: "",
    city: "",
    companyName: "",
    timeSlot: "",
    appointmentDate: "",
    bp: "",
    height: "",
    weight: "",
    bmi: "",
  });

  const [packages, setPackages] = useState([]);
  const [subPackages, setSubPackages] = useState([]);

  // Fetch packages based on client_id
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const clientId = localStorage.getItem("client_id");
        const response = await api.get(
          `/packages/clients/${clientId}/packages`
        );
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  // Fetch subpackages when package changes
  useEffect(() => {
    const fetchSubPackages = async () => {
      try {
        if (userData.package) {
          const response = await api.get(
            `/subpackages/packages/${userData.package}`
          );
          setSubPackages(response.data);
        } else {
          setSubPackages([]);
        }
      } catch (error) {
        console.error("Error fetching subpackages:", error);
      }
    };

    fetchSubPackages();
  }, [userData.package]);

  // Calculate BMI when height or weight changes
  useEffect(() => {
    if (userData.height && userData.weight) {
      const heightInMeters = userData.height / 100; // Convert cm to meters
      const calculatedBMI = (
        userData.weight /
        (heightInMeters * heightInMeters)
      ).toFixed(2);
      setUserData((prevUserData) => ({
        ...prevUserData,
        bmi: calculatedBMI,
      }));
    }
  }, [userData.height, userData.weight]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    // Generate booking ID when employee ID changes
    if (name === "employeeId") {
      const dateObj = new Date();
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = String(dateObj.getFullYear()).slice(-2);
      const newBookingId = `${value}${day}${month}${year}`;
      setUserData((prevData) => ({
        ...prevData,
        bookingId: newBookingId,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const clientId = localStorage.getItem("client_id");
      const userPayload = {
        client_id: clientId,
        phone_number: userData.phoneNumber,
        patient_name: userData.patientName,
        employee_id: userData.employeeId,
        email: userData.email,
        age: userData.age,
        gender: userData.gender,
        package: userData.package,
        sub_package: userData.subPackage,
        booking_id: userData.bookingId,
        reports_taken: userData.reportsTaken,
        additional_info: userData.additionalInfo,
        city: userData.city,
        company_name: userData.companyName,
        timeslot: userData.timeSlot,
        collection_type: "onSite",
      };

      // Create user
      const userResponse = await api.post("/users/user", userPayload);

      // Create onsite_collection
      const onsitePayload = {
        user_id: userResponse.data.id,
        scheduledDate: userData.appointmentDate,
        scheduledTime: userData.timeSlot.split(" - ")[0], // Assuming timeSlot is "HH:MM AM/PM - HH:MM AM/PM"
      };
      await api.post("/onsite-collections", onsitePayload);

      alert("User registered successfully for Onsite Collection!");

      // Reset form
      setUserData({
        phoneNumber: "",
        patientName: "",
        employeeId: "",
        email: "",
        age: "",
        gender: "Male",
        package: "",
        subPackage: "",
        bookingId: "",
        reportsTaken: 0,
        additionalInfo: "",
        city: "",
        companyName: "",
        timeSlot: "",
        appointmentDate: "",
        bp: "",
        height: "",
        weight: "",
        bmi: "",
      });
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error registering user. Please try again.");
    }
  };

  const handleTimeSlotChange = (e) => {
    const selectedTimeSlot = e.target.value;
    setUserData((prevData) => ({
      ...prevData,
      timeSlot: selectedTimeSlot,
    }));
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setUserData((prevData) => ({
      ...prevData,
      appointmentDate: selectedDate,
    }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Employee ID</Form.Label>
            <Form.Control
              type="text"
              name="employeeId"
              value={userData.employeeId}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="patientName"
              value={userData.patientName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={userData.age}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={userData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Package</Form.Label>
            <Form.Select
              name="package"
              value={userData.package}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Package</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Sub Package</Form.Label>
            <Form.Select
              name="subPackage"
              value={userData.subPackage}
              onChange={handleInputChange}
              required
              disabled={!subPackages.length}
            >
              <option value="">Select Sub Package</option>
              {subPackages.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Booking ID</Form.Label>
            <Form.Control
              type="text"
              name="bookingId"
              value={userData.bookingId}
              readOnly
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Reports Taken</Form.Label>
            <Form.Select
              name="reportsTaken"
              value={userData.reportsTaken}
              onChange={handleInputChange}
              required
            >
              <option value={1}>Done</option>
              <option value={0}>Pending</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Additional Info</Form.Label>
            <Form.Control
              type="text"
              name="additionalInfo"
              value={userData.additionalInfo}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={userData.city}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Appointment Date</Form.Label>
            <Form.Control
              type="date"
              name="appointmentDate"
              value={userData.appointmentDate}
              onChange={handleDateChange}
              required
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Time Slot</Form.Label>
            <Form.Select
              name="timeSlot"
              value={userData.timeSlot}
              onChange={handleTimeSlotChange}
              required
            >
              <option value="">Select Time Slot</option>
              <option value="08:00 AM - 12:00 PM">08:00 AM - 12:00 PM</option>
              <option value="12:00 PM - 04:00 PM">12:00 PM - 04:00 PM</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Blood Pressure (BP)</Form.Label>
            <Form.Control
              type="text"
              name="bp"
              value={userData.bp}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Height (in cm)</Form.Label>
            <Form.Control
              type="number"
              name="height"
              value={userData.height}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Weight (in kg)</Form.Label>
            <Form.Control
              type="number"
              name="weight"
              value={userData.weight}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>BMI</Form.Label>
            <Form.Control
              type="text"
              name="bmi"
              value={userData.bmi}
              readOnly
            />
          </Form.Group>
        </Col>
      </Row>

      <Button variant="primary" type="submit" className="mt-3">
        Register
      </Button>
    </Form>
  );
};

export default OnsiteRegs;
