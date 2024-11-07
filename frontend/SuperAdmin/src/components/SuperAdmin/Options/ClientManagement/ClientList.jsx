import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import ClientForm from "./ClientForm";
import ConfirmationModal from "../../../common/ConfirmationModal";
import api from "../../../../api/apiService";
import { downloadExcel } from "../../../../utils/Utils";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", email: "", city: "" });
  const [editingClient, setEditingClient] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/clients", { params: filters });
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch clients.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ name: "", email: "", city: "" });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/clients/${deleteId}`);
      setClients(clients.filter((client) => client.id !== deleteId));
      toast.success("Client deleted successfully.");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client.");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleClientAddedOrUpdated = (client) => {
    if (editingClient) {
      setClients((prev) => prev.map((c) => (c.id === client.id ? client : c)));
      setEditingClient(null);
    } else {
      setClients((prev) => [...prev, client]);
    }
    fetchClients();
  };

  const renderServices = (client) => {
    const services = [];
    if (client.servicesRequestedOnsite === 1) services.push("Onsite");
    if (client.servicesRequestedOffsite === 1) services.push("Offsite");
    if (client.servicesRequestedHomecollection === 1)
      services.push("Home Collection");
    return services.join(", ") || "None";
  };

  const handleEditClick = (client) => {
    setEditingClient(client);
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h2>Clients</h2>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Filter by name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Filter by email"
            name="email"
            value={filters.email}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Filter by city"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={3}>
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <ClientForm onClientAddedOrUpdated={handleClientAddedOrUpdated} />
        </Col>
        <Col className="text-end">
          <Button
            variant="success"
            onClick={() => downloadExcel(clients, "clients.xlsx")}
          >
            Download Excel
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Services</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.clientId}</td>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phoneNumber}</td>
                <td>{client.city}</td>
                <td style={{ color: "black" }}>{renderServices(client)}</td>
                <td>
                  <Link
                    to={`/super-admin/clients/${client.id}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    View
                  </Link>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditClick(client)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(client.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {editingClient && (
        <ClientForm
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onClientAddedOrUpdated={handleClientAddedOrUpdated}
        />
      )}

      <ConfirmationModal
        show={showDeleteModal}
        title="Delete Client"
        message="Are you sure you want to delete this client?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </Container>
  );
};

export default ClientList;
