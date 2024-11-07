// hrSide/src/components/Options/HomeRegs.jsx

import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import api from "../../api/apiService";

const HomeRegs = ({ clientId }) => {
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
    streetAddress: "",
    cityAddress: "",
    stateAddress: "",
    zipCode: "",
    landmark: "",
    preferredVendor: "",
    preferredLanguage: "",
  });

  const [packages, setPackages] = useState([]);
  const [subPackages, setSubPackages] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [timeSlots] = useState([
    "08:00 AM - 12:00 PM",
    "12:00 PM - 04:00 PM",
  ]);
  const [showDependentModal, setShowDependentModal] = useState(false);
  const [dependentData, setDependentData] = useState({
    name: "",
    relationship: "",
    age: "",
    gender: "Male",
    package: "",
    subPackage: "",
  });
  const [dependents, setDependents] = useState([]);

  // Fetch packages based on clientId
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get(`/packages?client_id=${clientId}`);
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    const fetchVendors = async () => {
      try {
        const response = await api.get(`/vendors`);
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchPackages();
    fetchVendors();
  }, [clientId]);

  // Fetch sub-packages based on selected package
  useEffect(() => {
    const fetchSubPackages = async () => {
      if (userData.package) {
        try {
          const response = await api.get(`/subpackages?package_id=${userData.package}`);
          setSubPackages(response.data);
        } catch (error) {
          console.error("Error fetching sub-packages:", error);
        }
      } else {
        setSubPackages([]);
      }
    };

    fetchSubPackages();
  }, [userData.package]);

  // Generate Booking ID when employee ID changes
  useEffect(() => {
    if (userData.employeeId) {
      const dateObj = new Date();
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = String(dateObj.getFullYear()).toString().slice(-2);
      const newBookingId = `${userData.employeeId}${day}${month}${year}`;
      setUserData((prevData) => ({
        ...prevData,
        bookingId: newBookingId,
      }));
    }
  }, [userData.employeeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleTimeSlotChange = (e) => {
    const selectedTimeSlot = e.target.value;
    const formattedDate = userData.appointmentDate
      ? ` on ${userData.appointmentDate}`
      : "";
    setUserData((prevData) => ({
      ...prevData,
      timeSlot: `${selectedTimeSlot}${formattedDate}`,
    }));
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setUserData((prevData) => ({
      ...prevData,
      appointmentDate: selectedDate,
      timeSlot: prevData.timeSlot.split(" on ")[0] + ` on ${selectedDate}`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const isValid = Object.values(userData).every(
      (field) => field !== "" && field !== null
    );

    if (!isValid) {
      alert("Please fill all the mandatory fields.");
      return;
    }

    try {
      // Create user entry
      const userResponse = await api.post(`/users`, {
        ...userData,
        collection_type: "home",
      });

      const userId = userResponse.data.id;

      // Create home collection entry
      await api.post(`/home_collections`, {
        user_id: userId,
        dependents_count: dependents.length,
        streetAddress: userData.streetAddress,
        cityAddress: userData.cityAddress,
        stateAddress: userData.stateAddress,
        zipCode: userData.zipCode,
        landmark: userData.landmark,
        scheduledDate: userData.appointmentDate,
        scheduledTime: userData.timeSlot.split(" on ")[0],
        preferredVendor: userData.preferredVendor,
        preferredLanguage: userData.preferredLanguage,
      });

      // Create dependents entries
      if (dependents.length > 0) {
        const dependentsPayload = dependents.map((dep) => ({
          user_id: userId,
          name: dep.name,
          age: dep.age,
          relationship: dep.relationship,
          gender: dep.gender,
          package: dep.package,
          subPackage: dep.subPackage,
        }));

        await api.post(`/dependents/bulk`, dependentsPayload);
      }

      alert("Home Collection Registered Successfully!");

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
        streetAddress: "",
        cityAddress: "",
        stateAddress: "",
        zipCode: "",
        landmark: "",
        preferredVendor: "",
        preferredLanguage: "",
      });
      setDependents([]);
    } catch (error) {
      console.error("Error registering home collection:", error);
      alert("Error registering home collection. Please try again.");
    }
  };

  // Dependent Modal Handlers
  const handleDependentInputChange = (e) => {
    const { name, value } = e.target;
    setDependentData({ ...dependentData, [name]: value });
  };

  const addDependent = () => {
    const isValid = Object.values(dependentData).every(
      (field) => field !== "" && field !== null
    );

    if (!isValid) {
      alert("Please fill all dependent fields.");
      return;
    }

    setDependents([...dependents, dependentData]);
    setDependentData({
      name: "",
      relationship: "",
      age: "",
      gender: "Male",
      package: "",
      subPackage: "",
    });
    setShowDependentModal(false);
  };

  const removeDependent = (index) => {
    const updatedDependents = [...dependents];
    updatedDependents.splice(index, 1);
    setDependents(updatedDependents);
  };

  return (
    <Container className="mt-5">
      <h3>Home Collection Registration</h3>
      <Form onSubmit={handleSubmit}>
        {/* User Details */}
        <Row className="mt-4">
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
              <Form.Label>Patient Name</Form.Label>
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

        {/* Package Selection */}
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

        {/* Additional Info */}
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
                required
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

        {/* Appointment Details */}
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
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Home Address Details */}
        <h5 className="mt-4">Home Address</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Street Address</Form.Label>
              <Form.Control
                type="text"
                name="streetAddress"
                value={userData.streetAddress}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>City Address</Form.Label>
              <Form.Control
                type="text"
                name="cityAddress"
                value={userData.cityAddress}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>State Address</Form.Label>
              <Form.Control
                type="text"
                name="stateAddress"
                value={userData.stateAddress}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                name="zipCode"
                value={userData.zipCode}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Landmark</Form.Label>
              <Form.Control
                type="text"
                name="landmark"
                value={userData.landmark}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Vendor and Language Preferences */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Preferred Vendor</Form.Label>
              <Form.Select
                name="preferredVendor"
                value={userData.preferredVendor}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Preferred Language</Form.Label>
              <Form.Select
                name="preferredLanguage"
                value={userData.preferredLanguage}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                {/* Add more languages as needed */}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Dependents Section */}
        <h5 className="mt-4">Dependents</h5>
        <Button variant="secondary" onClick={() => setShowDependentModal(true)}>
          Add Dependent
        </Button>
        {dependents.length > 0 && (
          <div className="mt-3">
            {dependents.map((dep, index) => (
              <div key={index} className="mb-2 p-3 border rounded">
                <Row>
                  <Col md={10}>
                    <p>
                      <strong>Name:</strong> {dep.name} | <strong>Relationship:</strong>{" "}
                      {dep.relationship} | <strong>Age:</strong> {dep.age} |{" "}
                      <strong>Gender:</strong> {dep.gender} | <strong>Package:</strong>{" "}
                      {dep.package} | <strong>Sub Package:</strong> {dep.subPackage}
                    </p>
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="danger"
                      onClick={() => removeDependent(index)}
                      size="sm"
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <Button variant="primary" type="submit" className="mt-4">
          Register
        </Button>
      </Form>

      {/* Dependent Modal */}
      <Modal show={showDependentModal} onHide={() => setShowDependentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Dependent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Dependent Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={dependentData.name}
                onChange={handleDependentInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Relationship</Form.Label>
              <Form.Control
                type="text"
                name="relationship"
                value={dependentData.relationship}
                onChange={handleDependentInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={dependentData.age}
                onChange={handleDependentInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={dependentData.gender}
                onChange={handleDependentInputChange}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Package</Form.Label>
              <Form.Select
                name="package"
                value={dependentData.package}
                onChange={handleDependentInputChange}
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

            <Form.Group className="mb-3">
              <Form.Label>Sub Package</Form.Label>
              <Form.Select
                name="subPackage"
                value={dependentData.subPackage}
                onChange={handleDependentInputChange}
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

            <Button variant="primary" onClick={addDependent}>
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default HomeRegs;
