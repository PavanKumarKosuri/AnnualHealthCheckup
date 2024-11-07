/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Modal, Table } from "react-bootstrap";
import api from "../../api/apiService";

const OffsiteRegs = () => {
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
    collectionType: "offSite",
    locationId: "",
    diagnosticCenterId: "",
  });

  const [packages, setPackages] = useState([]);
  const [subPackages, setSubPackages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [diagnosticCenters, setDiagnosticCenters] = useState([]);
  const [dependents, setDependents] = useState([]);
  const [showDependentModal, setShowDependentModal] = useState(false);
  const [newDependent, setNewDependent] = useState({
    name: "",
    age: "",
    relationship: "",
    gender: "Male",
    package: "",
    subPackage: "",
  });

  // Fetch packages based on client_id
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const clientId = localStorage.getItem("client_id");
        const response = await api.get(`/packages?client_id=${clientId}`);
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
            `/subpackages?package_id=${userData.package}`
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

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/offsite_locations");
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  // Fetch diagnostic centers based on selected location
  useEffect(() => {
    const fetchDiagnosticCenters = async () => {
      try {
        if (userData.locationId) {
          const response = await api.get(
            `/diagnostic_centers?location_id=${userData.locationId}`
          );
          setDiagnosticCenters(response.data);
        } else {
          setDiagnosticCenters([]);
        }
      } catch (error) {
        console.error("Error fetching diagnostic centers:", error);
      }
    };

    fetchDiagnosticCenters();
  }, [userData.locationId]);

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
        collection_type: "offSite",
      };

      // Create user
      const userResponse = await api.post("/users", userPayload);

      // Create offsite_collection
      const offsitePayload = {
        user_id: userResponse.data.id,
        offsite_location_id: userData.locationId,
        diagnostic_center_id: userData.diagnosticCenterId,
        dependents_count: dependents.length,
        scheduledDate: userData.appointmentDate,
        scheduledTime: userData.timeSlot.split(" - ")[0], // Assuming timeSlot is "HH:MM AM/PM - HH:MM AM/PM"
      };
      await api.post("/offsite_collections", offsitePayload);

      // Create dependents if any
      if (dependents.length > 0) {
        const dependentsPayload = dependents.map((dep) => ({
          user_id: userResponse.data.id,
          name: dep.name,
          age: dep.age,
          relationship: dep.relationship,
          gender: dep.gender,
          package: dep.package,
          subPackage: dep.subPackage,
        }));
        await api.post("/dependents", dependentsPayload);
      }

      alert("User registered successfully for Offsite Collection!");

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
        collectionType: "offSite",
        locationId: "",
        diagnosticCenterId: "",
      });
      setDependents([]);
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

  const handleDependentChange = (e) => {
    const { name, value } = e.target;
    setNewDependent({ ...newDependent, [name]: value });
  };

  const addDependent = () => {
    if (
      newDependent.name &&
      newDependent.age &&
      newDependent.relationship &&
      newDependent.package &&
      newDependent.subPackage
    ) {
      setDependents([...dependents, newDependent]);
      setNewDependent({
        name: "",
        age: "",
        relationship: "",
        gender: "Male",
        package: "",
        subPackage: "",
      });
      setShowDependentModal(false);
    } else {
      alert("Please fill all dependent fields.");
    }
  };

  const removeDependent = (index) => {
    const updatedDependents = [...dependents];
    updatedDependents.splice(index, 1);
    setDependents(updatedDependents);
  };

  return (
    <>
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

        {/* Additional Fields Similar to OnsiteRegs */}
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

        {/* Package and SubPackage Selection */}
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

        {/* Reports Taken and Additional Info */}
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

        {/* Location and Diagnostic Center Selection */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Select
                name="locationId"
                value={userData.locationId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Diagnostic Center</Form.Label>
              <Form.Select
                name="diagnosticCenterId"
                value={userData.diagnosticCenterId}
                onChange={handleInputChange}
                required
                disabled={!diagnosticCenters.length}
              >
                <option value="">Select Diagnostic Center</option>
                {diagnosticCenters.map((dc) => (
                  <option key={dc.id} value={dc.id}>
                    {dc.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Appointment Date and Time Slot */}
        <Row>
          <Col md={6}>
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

          <Col md={6}>
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
        </Row>

        {/* Dependents Section */}
        <Row>
          <Col>
            <Button
              variant="secondary"
              onClick={() => setShowDependentModal(true)}
            >
              Add Dependent
            </Button>
          </Col>
        </Row>

        {/* Dependents Table */}
        {dependents.length > 0 && (
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Age</th>
                <th>Relationship</th>
                <th>Gender</th>
                <th>Package</th>
                <th>Sub Package</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dependents.map((dep, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{dep.name}</td>
                  <td>{dep.age}</td>
                  <td>{dep.relationship}</td>
                  <td>{dep.gender}</td>
                  <td>
                    {packages.find((p) => p.id === dep.package)?.name || ""}
                  </td>
                  <td>
                    {subPackages.find((s) => s.id === dep.subPackage)?.name ||
                      ""}
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeDependent(index)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Submit Button */}
        <Button variant="primary" type="submit" className="mt-3">
          Register
        </Button>
      </Form>

      {/* Dependent Modal */}
      <Modal
        show={showDependentModal}
        onHide={() => setShowDependentModal(false)}
      >
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
                value={newDependent.name}
                onChange={handleDependentChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={newDependent.age}
                onChange={handleDependentChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Relationship</Form.Label>
              <Form.Control
                type="text"
                name="relationship"
                value={newDependent.relationship}
                onChange={handleDependentChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={newDependent.gender}
                onChange={handleDependentChange}
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
                value={newDependent.package}
                onChange={handleDependentChange}
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
                value={newDependent.subPackage}
                onChange={handleDependentChange}
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDependentModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={addDependent}>
            Add Dependent
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OffsiteRegs;
