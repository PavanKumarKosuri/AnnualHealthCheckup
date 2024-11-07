// src/components/PhlebotomistSettings.jsx

import React, { useEffect, useState } from "react";
import { Button, Spinner, Modal, Form, Table, Row, Col } from "react-bootstrap";
import api from "../../../../api/apiService";
import { toast } from "react-toastify";
import { FaEye, FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { downloadExcel } from "../../../../utils/Utils"; // Adjust the import path as needed

const animatedComponents = makeAnimated();

const ITEMS_PER_PAGE = 10;

const PhlebotomistSettings = () => {
  const [phlebotomists, setPhlebotomists] = useState([]);
  const [clients, setClients] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPhlebotomist, setSelectedPhlebotomist] = useState(null);
  const [assignForm, setAssignForm] = useState({
    client_id: "",
    start_date: "",
    end_date: "",
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [details, setDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [phlebotomistOptions, setPhlebotomistOptions] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetchPhlebotomists();
    fetchClients();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchPhlebotomists = async () => {
    setPhlebotomists([]);
    try {
      const response = await api.get("/phlebotomists");
      setPhlebotomists(response.data);

      const options = response.data.map((phlebo) => ({
        value: phlebo.id,
        label: phlebo.name,
        status: phlebo.status,
      }));
      setPhlebotomistOptions(options);
    } catch (err) {
      console.error("Error fetching phlebotomists:", err);
      toast.error("Failed to fetch phlebotomists.");
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      toast.error("Failed to fetch clients.");
    }
  };

  const handleAssignPhlebotomist = (selectedOption) => {
    if (!selectedOption) return;
    setIsAssigning(true);
    try {
      const phlebotomist = phlebotomists.find(
        (p) => p.id === selectedOption.value
      );
      if (!phlebotomist) {
        toast.error("Phlebotomist not found.");
        setIsAssigning(false);
        return;
      }
      if (phlebotomist.status === "assigned") {
        toast.error("Phlebotomist is already assigned.");
        setIsAssigning(false);
        return;
      }
      setSelectedPhlebotomist(phlebotomist);
      setAssignForm({
        client_id: "",
        start_date: "",
        end_date: "",
      });
      setShowAssignModal(true);
    } catch (err) {
      console.error("Error during assign process:", err);
      toast.error("Failed to initiate assignment.");
    }
    setIsAssigning(false);
  };

  const handleAssignSubmit = async () => {
    const { client_id, start_date, end_date } = assignForm;
    if (!client_id || !start_date || !end_date) {
      toast.error("All fields are required.");
      return;
    }

    if (new Date(start_date) > new Date(end_date)) {
      toast.error("Start Date cannot be after End Date.");
      return;
    }

    try {
      await api.post(`/phlebotomists/${selectedPhlebotomist.id}/assign`, {
        client_id,
        start_date,
        end_date,
      });
      toast.success("Phlebotomist assigned successfully.");
      setShowAssignModal(false);
      fetchPhlebotomists();
    } catch (err) {
      console.error("Error assigning phlebotomist:", err);
      toast.error(
        err.response?.data?.error || "Failed to assign phlebotomist."
      );
    }
  };

  const handleViewDetails = async (phlebotomist) => {
    setIsLoadingDetails(true);
    try {
      const [assignRes, perfRes] = await Promise.all([
        api.get(`/phlebotomists/${phlebotomist.id}/assignments`),
        api.get(`/phlebotomists/${phlebotomist.id}/performance`),
      ]);
      setDetails({
        assignments: assignRes.data,
        performance: perfRes.data,
      });
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Error fetching details:", err);
      toast.error("Failed to fetch details.");
    }
    setIsLoadingDetails(false);
  };

  const handleUnassign = (phlebotomist) => {
    setSelectedPhlebotomist(phlebotomist);
    setShowUnassignModal(true);
  };

  const confirmUnassign = async () => {
    try {
      await api.post(`/phlebotomists/${selectedPhlebotomist.id}/unassign`);
      toast.success("Phlebotomist unassigned successfully.");
      setShowUnassignModal(false);
      fetchPhlebotomists();
    } catch (err) {
      console.error("Error unassigning phlebotomist:", err);
      toast.error(
        err.response?.data?.error || "Failed to unassign phlebotomist."
      );
    }
  };

  const handleDownloadDetails = async (phlebotomist) => {
    if (!phlebotomist || !phlebotomist.id) {
      toast.error("Invalid phlebotomist selected.");
      return;
    }

    try {
      const [assignRes, perfRes] = await Promise.all([
        api.get(`/phlebotomists/${phlebotomist.id}/assignments`),
        api.get(`/phlebotomists/${phlebotomist.id}/performance`),
      ]);

      // Prepare data for Excel using downloadExcel utility
      const assignments = assignRes.data.map((assign) => ({
        Client_Name: assign.client_name,
        Start_Date: assign.start_date,
        End_Date: assign.end_date,
      }));

      const performance = [
        {
          Total_Tests_Performed: perfRes.data.total_tests,
          Medical_Camps_Assigned: perfRes.data.medical_camps_assigned,
        },
      ];

      const excelData = {
        Assignments: assignments,
        Performance: performance,
      };

      downloadExcel(excelData, `phlebotomist_${phlebotomist.id}_details.xlsx`);
    } catch (err) {
      console.error("Error downloading details:", err);
      if (err.response) {
        toast.error(
          err.response.data?.error ||
            `Failed to download details. Status Code: ${err.response.status}`
        );
      } else if (err.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const filteredPhlebotomists = phlebotomists.filter((phlebo) =>
    Object.keys(phlebo).some((key) =>
      phlebo[key]
        ? phlebo[key]
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : false
    )
  );

  const totalPages = Math.ceil(filteredPhlebotomists.length / ITEMS_PER_PAGE);
  const paginatedPhlebotomists = filteredPhlebotomists.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mt-4">
      <h2>Phlebotomists Settings</h2>

      {/* Controls: Assign via Type-ahead, and Search */}
      <div className="d-flex justify-content-between align-items-center my-3">
        {/* Assign Phlebotomist via Type-ahead */}
        <div style={{ width: "300px" }}>
          <Select
            components={animatedComponents}
            options={phlebotomistOptions}
            onChange={handleAssignPhlebotomist}
            placeholder="Assign Phlebotomist..."
            isLoading={isAssigning}
            getOptionLabel={(option) => (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: option.status === "free" ? "green" : "red",
                    marginRight: "8px",
                  }}
                ></span>
                {option.label}
              </div>
            )}
            getOptionValue={(option) => option.value}
            isClearable
          />
        </div>

        {/* Search Input */}
        <Form.Group style={{ width: "300px" }}>
          <Form.Control
            type="text"
            placeholder="Search phlebotomists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
      </div>

      {/* Phlebotomists Table */}
      <div style={{ overflowX: "auto" }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Unique ID</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPhlebotomists.length > 0 ? (
              paginatedPhlebotomists.map((phlebo) => (
                <tr key={phlebo.id}>
                  <td>{phlebo.id}</td>
                  <td>{phlebo.name}</td>
                  <td>{phlebo.uniqueId}</td>
                  <td>{phlebo.phoneNumber}</td>
                  <td>{phlebo.email}</td>
                  <td>
                    {phlebo.status === "free" ? (
                      <span className="badge bg-success">Free</span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        Assigned
                      </span>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleViewDetails(phlebo)}
                    >
                      <FaEye />
                    </Button>
                    {phlebo.status === "free" ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() =>
                          handleAssignPhlebotomist({
                            value: phlebo.id,
                            label: phlebo.name,
                            status: phlebo.status,
                          })
                        }
                      >
                        <FaEdit />
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleUnassign(phlebo)}
                      >
                        <FaTrash />
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleDownloadDetails(phlebo)}
                    >
                      <FaDownload />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No phlebotomists found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredPhlebotomists.length)}{" "}
          of {filteredPhlebotomists.length} entries
        </div>
        <div>
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline-primary"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Assign Phlebotomist Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Phlebotomist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPhlebotomist && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Phlebotomist Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedPhlebotomist.name}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Client</Form.Label>
                <Form.Select
                  value={assignForm.client_id}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, client_id: e.target.value })
                  }
                >
                  <option value="">Select Client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={assignForm.start_date}
                      onChange={(e) =>
                        setAssignForm({
                          ...assignForm,
                          start_date: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={assignForm.end_date}
                      onChange={(e) =>
                        setAssignForm({
                          ...assignForm,
                          end_date: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAssignSubmit}>
            Assign
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Phlebotomist Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoadingDetails ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : details ? (
            <>
              <h5>Assignments</h5>
              {details.assignments.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.assignments.map((assign) => (
                      <tr key={assign.id}>
                        <td>{assign.clientName || "N/A"}</td>
                        <td>
                          {new Date(assign.startDate).toLocaleDateString() ||
                            "N/A"}
                        </td>
                        <td>
                          {new Date(assign.endDate).toLocaleDateString() ||
                            "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No assignments found.</p>
              )}
              <h5 className="mt-4">Performance</h5>
              <p>
                <strong>Total Tests Performed:</strong>{" "}
                {details.performance.totalTests}
              </p>
              <p>
                <strong>Medical Camps Assigned:</strong>{" "}
                {details.performance.medicalCampsAssigned}
              </p>
            </>
          ) : (
            <p>No details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Unassign Confirmation Modal */}
      <Modal
        show={showUnassignModal}
        onHide={() => setShowUnassignModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Unassign Phlebotomist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to unassign{" "}
          {selectedPhlebotomist ? selectedPhlebotomist.name : ""} from their
          current assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowUnassignModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmUnassign}>
            Unassign
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PhlebotomistSettings;
