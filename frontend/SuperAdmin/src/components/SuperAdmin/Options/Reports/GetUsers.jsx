import React, { useEffect, useState } from "react";
import api from "../../../../api/apiService";
import { toast } from "react-toastify";
import {
  handleInputChange,
  handleEditInputChange,
  downloadExcel,
} from "./commonFunctions";
import {
  Button,
  Spinner,
  Modal,
  Form,
  Table,
  Row,
  Col,
  Accordion,
} from "react-bootstrap";
import { ChevronDown, ChevronRight, FileX } from "react-bootstrap-icons";

const ITEMS_PER_PAGE = 10;

const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [cities, setCities] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activeTab] = useState("user");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filters, setFilters] = useState({
    client_id: "",
    searchCriteria: "phone_number",
    searchText: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isFilterCollapseOpen, setIsFilterCollapseOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [openedRow, setOpenedRow] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState([
    "id",
    "patient_name",
    "phone_number",
    "email",
    "reports_taken",
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const allColumns = [
    "id",
    "client_id",
    "phone_number",
    "patient_name",
    "employee_id",
    "email",
    "age",
    "gender",
    "package",
    "sub_package",
    "booking_id",
    "reports_taken",
    "city",
    "company_name",
    "timeslot",
    "collection_type",
  ];

  useEffect(() => {
    fetchClients();
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      toast.error("Failed to fetch clients.");
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchCities = async (clientId = "") => {
    setLoadingFilters(true);
    try {
      const params = clientId ? { client_id: clientId } : {};
      const response = await api.get("/users/cities", { params });
      setCities(response.data);
    } catch (err) {
      console.error("Error fetching cities:", err);
      toast.error("Failed to fetch cities.");
    } finally {
      setLoadingFilters(false);
    }
  };

  const fetchCompanies = async (clientId = "") => {
    setLoadingFilters(true);
    try {
      const params = clientId ? { client_id: clientId } : {};
      const response = await api.get("/users/company_names", { params });
      setCompanies(response.data);
    } catch (err) {
      console.error("Error fetching company names:", err);
      toast.error("Failed to fetch company names.");
    } finally {
      setLoadingFilters(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const params = { ...filters };
      if (filters.searchCriteria && filters.searchText) {
        params.searchCriteria = filters.searchCriteria;
        params.searchText = filters.searchText;
      }
      const response = await api.get(`/users/filter`, { params });
      if (response.data.length === 0) {
        setErrorMessage("No user found with the specified filter criteria");
        toast.error("No users found.");
      } else {
        setErrorMessage("");
      }
      setUsers(response.data);
      fetchCities(filters.client_id);
      fetchCompanies(filters.client_id);
    } catch (error) {
      console.error("Error fetching filtered users:", error);
      toast.error("Failed to fetch users.");
      setErrorMessage(
        error.response?.data?.error || "An error occurred while fetching users."
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleFilter = async () => {
    try {
      await fetchUsers();
      toast.success("Filters applied successfully.");
    } catch (error) {
      console.error(`Error fetching filtered ${activeTab} reports:`, error);
      setErrorMessage(error.response?.data?.error || "Error fetching data");
      toast.error("Failed to apply filters.");
    }
  };

  const handleClearFilters = async () => {
    setFilters({
      client_id: "",
      searchCriteria: "phone_number",
      searchText: "",
    });
    setCities([]);
    setCompanies([]);
    try {
      await fetchUsers();
      toast.success("Filters cleared successfully.");
    } catch (error) {
      console.error("Error fetching all data:", error);
      setErrorMessage("Error fetching all data");
      toast.error("Failed to clear filters.");
    }
  };

  const handleSearchCriteriaChange = (e) => {
    const { value } = e.target;
    setFilters((prev) => ({
      ...prev,
      searchCriteria: value,
      searchText: "",
    }));
    if (value === "city") {
      fetchCities(filters.client_id);
    } else if (value === "company_name") {
      fetchCompanies(filters.client_id);
    }
  };

  const handleToggleRow = (entry) => {
    if (openedRow === entry.id) {
      setOpenedRow(null);
    } else {
      setOpenedRow(entry.id);
    }
  };

  const handleEdit = (entry) => {
    setCurrentEdit(entry);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/users/${deleteId}`);
      fetchUsers();
      setShowModal(false);
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error(`Error deleting ${activeTab} entry:`, error);
      toast.error("Failed to delete user.");
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const saveEdit = async () => {
    try {
      await api.put(`/users/${currentEdit.id}`, currentEdit);
      setIsEditing(false);
      setCurrentEdit(null);
      fetchUsers();
      toast.success("User updated successfully.");
    } catch (error) {
      console.error("Error saving edit:", error);
      toast.error("Failed to update user.");
    }
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusBadge = (status) => {
    return (
      <span className={`badge ${status ? "bg-success" : "bg-warning"}`}>
        {status ? "Taken" : "Pending"}
      </span>
    );
  };

  const columnKeyMap = {
    id: "id",
    client_id: "clientId",
    phone_number: "phoneNumber",
    patient_name: "patientName",
    employee_id: "employeeId",
    email: "email",
    age: "age",
    gender: "gender",
    package: "package",
    sub_package: "subPackage",
    booking_id: "bookingId",
    reports_taken: "reportsTaken",
    city: "city",
    company_name: "companyName",
    timeslot: "timeslot",
    collection_type: "collectionType",
    additional_info: "additionalInfo",
  };

  return (
    <div className="container mt-3">
      <div>
        <div className="card card-body">
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="filterClientId">
                <Form.Label>Client ID</Form.Label>
                {loadingClients ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <Form.Select
                    name="client_id"
                    value={filters.client_id}
                    onChange={(e) => handleInputChange(e, setFilters)}
                    onBlur={() => {
                      fetchCities(filters.client_id);
                      fetchCompanies(filters.client_id);
                    }}
                  >
                    <option value="">All Clients</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.client_id}>
                        {client.client_id} - {client.name}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="filterSearchCriteria">
                <Form.Label>Search By</Form.Label>
                <Form.Select
                  name="searchCriteria"
                  value={filters.searchCriteria}
                  onChange={handleSearchCriteriaChange}
                >
                  <option value="phone_number">Phone Number</option>
                  <option value="patient_name">Patient Name</option>
                  <option value="employee_id">Employee ID</option>
                  <option value="reports_pending">Reports Status</option>
                  <option value="city">City</option>
                  <option value="company_name">Company Name</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="filterSearchText">
                <Form.Label>Search Text</Form.Label>
                {filters.searchCriteria === "reports_pending" ? (
                  <Form.Select
                    name="searchText"
                    value={filters.searchText}
                    onChange={(e) => handleInputChange(e, setFilters)}
                  >
                    <option value="">Select One</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </Form.Select>
                ) : filters.searchCriteria === "city" ? (
                  loadingFilters ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <Form.Select
                      name="searchText"
                      value={filters.searchText}
                      onChange={(e) => handleInputChange(e, setFilters)}
                    >
                      <option value="">All Cities</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </Form.Select>
                  )
                ) : filters.searchCriteria === "company_name" ? (
                  loadingFilters ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <Form.Select
                      name="searchText"
                      value={filters.searchText}
                      onChange={(e) => handleInputChange(e, setFilters)}
                    >
                      <option value="">All Companies</option>
                      {companies.map((company, index) => (
                        <option key={index} value={company}>
                          {company}
                        </option>
                      ))}
                    </Form.Select>
                  )
                ) : (
                  <Form.Control
                    type={
                      filters.searchCriteria === "employee_id"
                        ? "number"
                        : "text"
                    }
                    placeholder={`Enter ${
                      filters.searchCriteria === "employee_id"
                        ? "Employee ID"
                        : "Search Text"
                    }`}
                    name="searchText"
                    value={filters.searchText}
                    onChange={(e) => handleInputChange(e, setFilters)}
                  />
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="outline-dark" onClick={handleFilter}>
                Apply Filters
              </Button>
              <Button
                variant="outline-dark"
                className="ms-2"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {errorMessage && <p className="text-danger">{errorMessage}</p>}

      <br />

      <a
        className="downloadLink"
        style={{ color: "black", cursor: "pointer" }}
        onClick={() => downloadExcel(users, "user_reports.xlsx")}
      >
        Download Excel
      </a>

      <Accordion defaultActiveKey="1" className="my-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Select Columns</Accordion.Header>
          <Accordion.Body>
            <Form.Group style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {allColumns.map((column) => (
                <Form.Check
                  key={column}
                  type="checkbox"
                  label={
                    column.replace("_", " ").charAt(0).toUpperCase() +
                    column.slice(1)
                  }
                  checked={visibleColumns.includes(column)}
                  onChange={() => handleColumnToggle(column)}
                />
              ))}
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* 
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group> */}

      <div style={{ overflowX: "auto" }}>
        <Table striped bordered hover size="sm" className="mt-3" responsive>
          <thead>
            <tr>
              <th></th>
              {visibleColumns.map((column) => (
                <th key={column}>
                  {column.replace("_", " ").charAt(0).toUpperCase() +
                    column.slice(1)}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              <tr>
                <td colSpan={visibleColumns.length + 2} className="text-center">
                  <Spinner animation="border" role="status" />
                </td>
              </tr>
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <tr>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => handleToggleRow(user)}
                        className="p-0"
                      >
                        {openedRow === user.id ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </Button>
                    </td>
                    {visibleColumns.map((column) => (
                      <td key={column}>
                        {isEditing &&
                        currentEdit &&
                        currentEdit.id === user.id ? (
                          column === "reports_taken" ? (
                            <Form.Select
                              name={column}
                              value={currentEdit[columnKeyMap[column]]}
                              onChange={(e) =>
                                handleEditInputChange(e, setCurrentEdit)
                              }
                            >
                              <option value="1">Yes</option>
                              <option value="0">No</option>
                            </Form.Select>
                          ) : (
                            <Form.Control
                              type="text"
                              name={column}
                              value={currentEdit[columnKeyMap[column]]}
                              onChange={(e) =>
                                handleEditInputChange(e, setCurrentEdit)
                              }
                            />
                          )
                        ) : column === "reports_taken" ? (
                          getStatusBadge(user[columnKeyMap[column]])
                        ) : (
                          user[columnKeyMap[column]] || "N/A" // To handle empty data gracefully
                        )}
                      </td>
                    ))}

                    <td>
                      {isEditing &&
                      currentEdit &&
                      currentEdit.id === user.id ? (
                        <Button variant="success" size="sm" onClick={saveEdit}>
                          Save
                        </Button>
                      ) : (
                        <div className="d-flex">
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {openedRow === user.id && (
                    <tr>
                      <td colSpan={visibleColumns.length + 2}>
                        <div className="p-3 bg-light">
                          <h6>Additional Details</h6>
                          <Row>
                            {allColumns
                              .filter((col) => !visibleColumns.includes(col))
                              .map((col) => (
                                <Col key={col} md={4} className="mb-2">
                                  <strong>
                                    {col
                                      .replace("_", " ")
                                      .charAt(0)
                                      .toUpperCase() + col.slice(1)}
                                    :
                                  </strong>{" "}
                                  {currentEdit
                                    ? currentEdit[columnKeyMap[col]]
                                    : user[columnKeyMap[col]] || "N/A"}
                                </Col>
                              ))}
                          </Row>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumns.length + 2} className="text-center">
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of{" "}
          {filteredUsers.length} entries
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
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GetUsers;
