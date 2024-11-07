import React, { useEffect, useState } from "react";
import api from "../../../../api/apiService";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  Table,
  Modal,
  Spinner,
  Badge,
  Accordion,
  Row,
  Col,
} from "react-bootstrap";
import { ChevronDown, ChevronRight } from "react-bootstrap-icons";

const ITEMS_PER_PAGE = 10;

const GetVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    serviceType: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState([
    "id",
    "name",
    "city",
    "serviceType",
    "testingCapacity",
    "phlebotomistCount",
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openedRow, setOpenedRow] = useState(null);

  const allColumns = [
    "id",
    "name",
    "phoneNumber",
    "email",
    "address",
    "city",
    "serviceType",
    "testingCapacity",
    "turnaroundTime",
    "accreditations",
    "phlebotomistCount",
  ];

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/vendors", { params: filters });
      if (Array.isArray(response.data)) {
        setVendors(response.data);
        if (response.data.length === 0) {
          setErrorMessage(
            "No vendors found with the specified filter criteria"
          );
        } else {
          setErrorMessage("");
        }
      } else {
        console.error("Expected an array of vendors, but got:", response.data);
        setErrorMessage(
          "Error: Received unexpected data format from the server"
        );
        setVendors([]);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setErrorMessage("Error fetching vendors");
      toast.error("Failed to fetch vendors.");
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleRow = (vendor) => {
    if (openedRow === vendor.id) {
      setOpenedRow(null);
    } else {
      setOpenedRow(vendor.id);
    }
  };

  const handleEdit = (vendor) => {
    setCurrentEdit(vendor);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/vendors/${deleteId}`);
      fetchVendors();
      setShowModal(false);
      toast.success("Vendor deleted successfully!");
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error("Error deleting vendor.");
    }
  };

  const saveEdit = async () => {
    try {
      await api.put(`/vendors/${currentEdit.id}`, currentEdit);
      setIsEditing(false);
      setCurrentEdit(null);
      fetchVendors();
      toast.success("Vendor updated successfully!");
    } catch (error) {
      console.error("Error saving edit:", error);
      toast.error("Error updating vendor.");
    }
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const filteredVendors = vendors.filter((vendor) =>
    Object.values(vendor).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredVendors.length / ITEMS_PER_PAGE);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getServiceTypeBadge = (type) => {
    switch (type.toLowerCase()) {
      case "testing":
        return <Badge bg="primary">Testing</Badge>;
      case "phlebotomy":
        return <Badge bg="success">Phlebotomy</Badge>;
      case "both":
        return <Badge bg="info">Testing & Phlebotomy</Badge>;
      default:
        return <Badge bg="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="container mt-3">
      {errorMessage && <p className="text-danger">{errorMessage}</p>}

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <Accordion defaultActiveKey="1" className="my-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Select Columns</Accordion.Header>
          <Accordion.Body>
            <Form.Group style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {allColumns.map((column) => (
                <Form.Check
                  key={column}
                  type="checkbox"
                  label={column.charAt(0).toUpperCase() + column.slice(1)}
                  checked={visibleColumns.includes(column)}
                  onChange={() => handleColumnToggle(column)}
                />
              ))}
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div style={{ overflowX: "auto" }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th></th>
              {visibleColumns.map((column) => (
                <th key={column}>
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={visibleColumns.length + 2} className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </td>
              </tr>
            ) : paginatedVendors.length > 0 ? (
              paginatedVendors.map((vendor) => (
                <React.Fragment key={vendor.id}>
                  <tr>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => handleToggleRow(vendor)}
                        className="p-0"
                      >
                        {openedRow === vendor.id ? (
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
                        currentEdit.id === vendor.id ? (
                          <Form.Control
                            type="text"
                            name={column}
                            value={currentEdit[column]}
                            onChange={(e) =>
                              handleInputChange(e, setCurrentEdit)
                            }
                          />
                        ) : column === "serviceType" ? (
                          getServiceTypeBadge(vendor[column])
                        ) : (
                          vendor[column]
                        )}
                      </td>
                    ))}
                    <td>
                      {isEditing &&
                      currentEdit &&
                      currentEdit.id === vendor.id ? (
                        <Button variant="success" size="sm" onClick={saveEdit}>
                          Save
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(vendor)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(vendor.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                  {openedRow === vendor.id && (
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
                                    {col.charAt(0).toUpperCase() + col.slice(1)}
                                    :
                                  </strong>{" "}
                                  {currentEdit ? currentEdit[col] : vendor[col]}
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
                  No vendors available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredVendors.length)} of{" "}
          {filteredVendors.length} entries
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this vendor?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
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

export default GetVendors;
